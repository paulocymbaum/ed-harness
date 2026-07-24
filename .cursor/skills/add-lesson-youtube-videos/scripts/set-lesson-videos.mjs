#!/usr/bin/env node
/**
 * Validate and write videos[] into a study lesson.meta.json.
 *
 * Usage:
 *   node set-lesson-videos.mjs --course <c> --module <m> --lesson <id> --videos '<json>'
 *   node set-lesson-videos.mjs --course <c> --module <m> --lesson <id> --videos-file <path>
 *   node set-lesson-videos.mjs --course <c> --module <m> --lesson <id> --clear
 *   node set-lesson-videos.mjs ... --dry-run
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");
const MAX_VIDEOS = 2;

const YT_WATCH = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/i;
const YT_SHORT = /^https:\/\/youtu\.be\/[\w-]{11}(\?.*)?$/i;

function parseArgs(argv) {
  const args = {
    course: null,
    module: null,
    lesson: null,
    videos: null,
    videosFile: null,
    clear: false,
    dryRun: false,
    help: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i] ?? null;
    else if (arg === "--module") args.module = argv[++i] ?? null;
    else if (arg === "--lesson") args.lesson = argv[++i] ?? null;
    else if (arg === "--videos") args.videos = argv[++i] ?? null;
    else if (arg === "--videos-file") args.videosFile = argv[++i] ?? null;
    else if (arg === "--clear") args.clear = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node set-lesson-videos.mjs --course <course> --module <module> --lesson <lesson-id> --videos '<json-array>'
  node set-lesson-videos.mjs --course <course> --module <module> --lesson <lesson-id> --videos-file <path>
  node set-lesson-videos.mjs --course <course> --module <module> --lesson <lesson-id> --clear
  node set-lesson-videos.mjs ... --dry-run

videos JSON item shape: { "url": "...", "title": "...", "views": 123456 }
Max ${MAX_VIDEOS} videos. Study lessons only (no *-mock modules).`);
}

function isYouTubeUrl(url) {
  return typeof url === "string" && (YT_WATCH.test(url) || YT_SHORT.test(url));
}

function normalizeVideo(raw, index) {
  const errors = [];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { error: `videos[${index}] must be an object` };
  }
  const url = raw.url;
  const title = raw.title;
  const views = raw.views;

  if (!isYouTubeUrl(url)) {
    errors.push(`videos[${index}].url must be youtube.com/watch or youtu.be`);
  }
  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push(`videos[${index}].title must be a non-empty string`);
  }
  if (typeof views !== "number" || !Number.isFinite(views) || views < 0) {
    errors.push(`videos[${index}].views must be a finite number >= 0`);
  }

  if (errors.length) return { error: errors.join("; ") };

  return {
    video: {
      url: url.trim(),
      title: title.trim(),
      views: Math.round(views),
    },
  };
}

function validateVideos(list) {
  if (!Array.isArray(list)) return { error: "videos must be an array" };
  if (list.length === 0) return { error: "videos must contain at least 1 item (or use --clear)" };
  if (list.length > MAX_VIDEOS) return { error: `videos must have at most ${MAX_VIDEOS} items` };

  const normalized = [];
  const seen = new Set();
  for (let i = 0; i < list.length; i += 1) {
    const { video, error } = normalizeVideo(list[i], i);
    if (error) return { error };
    const key = video.url.replace(/&.*$/, "").toLowerCase();
    if (seen.has(key)) return { error: `duplicate url: ${video.url}` };
    seen.add(key);
    normalized.push(video);
  }

  normalized.sort((a, b) => b.views - a.views);
  return { videos: normalized };
}

async function loadVideosPayload(args) {
  if (args.clear) return { videos: null };
  if (args.videosFile && args.videos) {
    return { error: "Provide either --videos or --videos-file, not both" };
  }
  if (!args.videosFile && !args.videos) {
    return { error: "Provide --videos, --videos-file, or --clear" };
  }

  let raw;
  if (args.videosFile) {
    const abs = path.resolve(args.videosFile);
    raw = JSON.parse(await fs.readFile(abs, "utf8"));
  } else {
    raw = JSON.parse(args.videos);
  }
  return validateVideos(raw);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(0);
  }
  if (!args.course || !args.module || !args.lesson) {
    printHelp();
    process.exit(1);
  }
  if (args.module.endsWith("-mock")) {
    console.error(`Refusing mock module: ${args.module}`);
    process.exit(1);
  }

  const lessonPath = path.join(
    repoRoot,
    "course",
    args.course,
    "modules",
    args.module,
    "lessons",
    args.lesson,
  );
  const metaPath = path.join(lessonPath, "lesson.meta.json");

  let meta;
  try {
    meta = JSON.parse(await fs.readFile(metaPath, "utf8"));
  } catch {
    console.error(`Missing or invalid lesson.meta.json at ${path.relative(repoRoot, metaPath)}`);
    process.exit(2);
  }

  if (meta.mockTestSection) {
    console.error(`Refusing mock section lesson (${meta.mockTestSection}): ${args.lesson}`);
    process.exit(1);
  }

  const payload = await loadVideosPayload(args);
  if (payload.error) {
    console.error(payload.error);
    process.exit(1);
  }

  const next = { ...meta };
  if (payload.videos === null) {
    delete next.videos;
  } else {
    next.videos = payload.videos;
  }

  const out = `${JSON.stringify(next, null, 2)}\n`;
  if (args.dryRun) {
    console.log(out);
    console.error(`[dry-run] would write ${path.relative(repoRoot, metaPath)}`);
    return;
  }

  await fs.writeFile(metaPath, out, "utf8");
  const count = Array.isArray(next.videos) ? next.videos.length : 0;
  console.log(`Wrote ${count} video(s) → ${path.relative(repoRoot, metaPath)}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
