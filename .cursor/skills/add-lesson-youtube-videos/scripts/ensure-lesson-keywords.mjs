#!/usr/bin/env node
/**
 * Derive and write keywords[] into study lesson.meta.json from title + description.
 *
 * Usage:
 *   node ensure-lesson-keywords.mjs --course javascript --module 01-javascript-fundamentals
 *   node ensure-lesson-keywords.mjs --course javascript --module 01-javascript-fundamentals --prefix 01.1
 *   node ensure-lesson-keywords.mjs ... --dry-run
 *   node ensure-lesson-keywords.mjs ... --force   # overwrite existing keywords
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deriveKeywordsFromMeta } from "./keywords-from-meta.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");

function parseArgs(argv) {
  const args = {
    course: null,
    module: null,
    prefix: null,
    lesson: null,
    dryRun: false,
    force: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i] ?? null;
    else if (arg === "--module") args.module = argv[++i] ?? null;
    else if (arg === "--prefix") args.prefix = argv[++i] ?? null;
    else if (arg === "--lesson") args.lesson = argv[++i] ?? null;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--force") args.force = true;
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

async function loadStackName(courseId) {
  const courseMeta = await readJsonSafe(path.join(repoRoot, "course", courseId, "course.meta.json"));
  const title = typeof courseMeta?.title === "string" ? courseMeta.title.trim() : "";
  if (title) return title;
  // Fallback: slug → Title Case (javascript → Javascript)
  return courseId
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function orderMeta(meta, keywords) {
  const {
    id, graphIndex, graphNodeId, title, description,
    lesson_dependencies, prerequisites, status, videos, mockTestSection,
    keywords: _oldKeywords,
    ...rest
  } = meta;
  const next = { ...rest };
  if (id !== undefined) next.id = id;
  if (graphIndex !== undefined) next.graphIndex = graphIndex;
  if (graphNodeId !== undefined) next.graphNodeId = graphNodeId;
  if (title !== undefined) next.title = title;
  if (description !== undefined) next.description = description;
  if (lesson_dependencies !== undefined) next.lesson_dependencies = lesson_dependencies;
  if (prerequisites !== undefined) next.prerequisites = prerequisites;
  if (status !== undefined) next.status = status;
  next.keywords = keywords;
  if (videos !== undefined) next.videos = videos;
  if (mockTestSection !== undefined) next.mockTestSection = mockTestSection;
  return next;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.course || !args.module) {
    console.error("Usage: node ensure-lesson-keywords.mjs --course <c> --module <m> [--prefix 01.1] [--lesson <id>] [--force] [--dry-run]");
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

  for (const lessonId of entries) {
    if (args.lesson && lessonId !== args.lesson) continue;
    if (args.prefix && !lessonId.startsWith(args.prefix)) continue;

    const metaPath = path.join(lessonsRoot, lessonId, "lesson.meta.json");
    const meta = await readJsonSafe(metaPath);
    if (!meta || meta.mockTestSection) {
      skipped += 1;
      continue;
    }
    if (!args.force && Array.isArray(meta.keywords) && meta.keywords.length > 0) {
      skipped += 1;
      console.log(`SKIP ${lessonId} (has ${meta.keywords.length} keywords; use --force)`);
      continue;
    }

    const keywords = deriveKeywordsFromMeta(meta, { stack });
    if (keywords.length === 0) {
      console.error(`FAIL ${lessonId}: could not derive keywords`);
      continue;
    }

    const next = orderMeta(meta, keywords);
    const out = `${JSON.stringify(next, null, 2)}\n`;
    if (args.dryRun) {
      console.log(`${lessonId}: ${JSON.stringify(keywords)}`);
    } else {
      await fs.writeFile(metaPath, out, "utf8");
      console.log(`Wrote ${keywords.length} keywords → ${path.relative(repoRoot, metaPath)}`);
      console.log(`  ${keywords.join(" · ")}`);
    }
    done += 1;
  }

  console.log(`\nDone: ${done} written, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
