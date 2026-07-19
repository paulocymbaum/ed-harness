#!/usr/bin/env node
/**
 * Search YouTube via yt-dlp using lesson keywords; write relevance-ranked videos.
 *
 * Ranking: keyword relevance first, view count as tie-breaker only.
 * Cap: 2 videos. Skips weak matches rather than padding.
 *
 * Usage:
 *   node fill-module-videos.mjs --course javascript --module 01-javascript-fundamentals
 *   node fill-module-videos.mjs --course javascript --module 01-javascript-fundamentals --prefix 01.1
 *   node fill-module-videos.mjs ... --all --dry-run
 */
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deriveKeywordsFromMeta, scoreVideoTitle } from "./keywords-from-meta.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const setScript = path.join(scriptDir, "set-lesson-videos.mjs");
const MAX_VIDEOS = 2;
const SEARCH_COUNT = 10;
const MIN_HITS = 1;
const MIN_SCORE = 18;
const SOFT_MIN_VIEWS = 5000;

function parseArgs(argv) {
  const args = {
    course: null,
    module: null,
    prefix: null,
    dryRun: false,
    missingOnly: true,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i] ?? null;
    else if (arg === "--module") args.module = argv[++i] ?? null;
    else if (arg === "--prefix") args.prefix = argv[++i] ?? null;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--all") args.missingOnly = false;
  }
  return args;
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function resolveKeywords(meta, stack) {
  if (Array.isArray(meta.keywords) && meta.keywords.length > 0) {
    const keywords = meta.keywords.map((k) => String(k).trim()).filter(Boolean);
    if (!stack) return keywords;
    const stackKey = String(stack).trim().toLowerCase();
    const withoutStack = keywords.filter((k) => k.toLowerCase() !== stackKey);
    return [String(stack).trim(), ...withoutStack];
  }
  return deriveKeywordsFromMeta(meta, { stack });
}

async function loadStackName(courseId) {
  const courseMeta = await readJsonSafe(path.join(repoRoot, "course", courseId, "course.meta.json"));
  const title = typeof courseMeta?.title === "string" ? courseMeta.title.trim() : "";
  if (title) return title;
  return courseId
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function buildQueries(keywords, title) {
  const k = keywords.filter(Boolean);
  const stack = k[0] || "JavaScript";
  const topic = k.slice(1);
  const queries = [];
  if (topic.length > 0) {
    queries.push(`${stack} ${topic.slice(0, 3).join(" ")}`);
    queries.push(`${topic.slice(0, 3).join(" ")} ${stack} tutorial`);
  }
  if (topic[0]) {
    queries.push(`${stack} ${topic[0]} explained`);
  }
  const cleanedTitle = String(title || "").replace(/[()]/g, " ").replace(/\s+/g, " ").trim();
  if (cleanedTitle) queries.push(`${stack} ${cleanedTitle} tutorial`);
  return [...new Set(queries)].slice(0, 3);
}

function parseYtSearch(stdout) {
  const rows = [];
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes("|")) continue;
    const [id, title, viewsRaw] = trimmed.split("|");
    if (!id || !/^[\w-]{11}$/.test(id)) continue;
    const views = Number(viewsRaw);
    if (!Number.isFinite(views) || views < 0) continue;
    rows.push({
      url: `https://www.youtube.com/watch?v=${id}`,
      title: (title || id).trim(),
      views: Math.round(views),
    });
  }
  return rows;
}

function ytSearch(query) {
  const result = spawnSync(
    "yt-dlp",
    [
      `ytsearch${SEARCH_COUNT}:${query}`,
      "--flat-playlist",
      "--print",
      "%(id)s|%(title)s|%(view_count)s",
      "--no-warnings",
    ],
    { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 },
  );
  if (result.status !== 0 && !result.stdout) {
    throw new Error(`yt-dlp failed for "${query}": ${result.stderr || result.error}`);
  }
  return parseYtSearch(result.stdout || "");
}

function pickVideos(candidates, keywords) {
  const byUrl = new Map();
  for (const c of candidates) {
    const scored = scoreVideoTitle(c.title, keywords);
    const prev = byUrl.get(c.url);
    const next = {
      ...c,
      score: scored.score,
      hits: scored.hits,
      topicHits: scored.topicHits || 0,
    };
    if (!prev || next.score > prev.score || (next.score === prev.score && next.views > prev.views)) {
      byUrl.set(c.url, next);
    }
  }

  let ranked = [...byUrl.values()]
    .filter((v) => v.hits >= MIN_HITS && v.score >= MIN_SCORE && v.topicHits >= 1)
    .sort((a, b) => b.score - a.score || b.views - a.views);

  // Prefer tutorials with real viewership when available among relevant hits
  const popular = ranked.filter((v) => v.views >= SOFT_MIN_VIEWS);
  if (popular.length > 0) ranked = popular;

  return ranked.slice(0, MAX_VIDEOS).map(({ url, title, views }) => ({ url, title, views }));
}

function writeVideos(args, lessonId, videos) {
  const cmdArgs = [
    setScript,
    "--course",
    args.course,
    "--module",
    args.module,
    "--lesson",
    lessonId,
    "--videos",
    JSON.stringify(videos),
  ];
  if (args.dryRun) cmdArgs.push("--dry-run");
  const result = spawnSync(process.execPath, cmdArgs, {
    encoding: "utf8",
    cwd: repoRoot,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `set-lesson-videos failed for ${lessonId}`);
  }
  return (result.stdout || "").trim();
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.course || !args.module) {
    console.error("Usage: node fill-module-videos.mjs --course <c> --module <m> [--prefix 01.1] [--dry-run] [--all]");
    process.exit(1);
  }
  if (args.module.endsWith("-mock")) {
    console.error(`Refusing mock module: ${args.module}`);
    process.exit(1);
  }

  const stack = await loadStackName(args.course);
  console.log(`Stack: ${stack}`);

  const lessonsRoot = path.join(repoRoot, "course", args.course, "modules", args.module, "lessons");
  const entries = (await listDirSafe(lessonsRoot))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const lessonId of entries) {
    if (args.prefix && !lessonId.startsWith(args.prefix)) continue;

    const meta = await readJsonSafe(path.join(lessonsRoot, lessonId, "lesson.meta.json"));
    if (!meta || meta.mockTestSection) {
      skipped += 1;
      continue;
    }
    if (args.missingOnly && Array.isArray(meta.videos) && meta.videos.length > 0) {
      skipped += 1;
      console.log(`SKIP ${lessonId} (already has ${meta.videos.length} videos)`);
      continue;
    }

    const keywords = resolveKeywords(meta, stack);
    const queries = buildQueries(keywords, meta.title || lessonId);
    process.stdout.write(`SEARCH ${lessonId}\n  keywords: ${keywords.join(" · ")}\n`);

    try {
      const candidates = [];
      for (const query of queries) {
        process.stdout.write(`  query: ${query}\n`);
        candidates.push(...ytSearch(query));
      }
      const videos = pickVideos(candidates, keywords);
      if (videos.length === 0) {
        console.error(`FAIL ${lessonId}: no relevant YouTube results (after keyword filter)`);
        failed += 1;
        continue;
      }
      for (const v of videos) {
        const s = scoreVideoTitle(v.title, keywords);
        console.log(`  pick: [${s.score}/${s.hits}] ${v.title} (${v.views})`);
      }
      const out = writeVideos(args, lessonId, videos);
      console.log(out || `OK ${lessonId} (${videos.length})`);
      done += 1;
    } catch (err) {
      console.error(`FAIL ${lessonId}: ${err.message || err}`);
      failed += 1;
    }
  }

  console.log(`\nDone: ${done} written, ${skipped} skipped, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
