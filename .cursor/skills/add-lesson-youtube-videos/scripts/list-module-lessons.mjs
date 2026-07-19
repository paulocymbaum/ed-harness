#!/usr/bin/env node
/**
 * List study lessons in a module and their videos coverage.
 *
 * Usage:
 *   node list-module-lessons.mjs --course javascript --module 01-javascript-fundamentals
 *   node list-module-lessons.mjs --course javascript --module 01-javascript-fundamentals --format json
 *   node list-module-lessons.mjs --course javascript --module 01-javascript-fundamentals --missing-only
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..", "..");

function parseArgs(argv) {
  const args = {
    course: null,
    module: null,
    format: "markdown",
    missingOnly: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i] ?? null;
    else if (arg === "--module") args.module = argv[++i] ?? null;
    else if (arg === "--format") args.format = argv[++i] ?? "markdown";
    else if (arg === "--missing-only") args.missingOnly = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
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

function printHelp() {
  console.log(`Usage:
  node list-module-lessons.mjs --course <course> --module <module> [--format markdown|json] [--missing-only]

Skips modules whose id ends with -mock.`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.course || !args.module) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  if (args.module.endsWith("-mock")) {
    console.error(`Refusing mock module: ${args.module} (study modules only)`);
    process.exit(1);
  }

  const lessonsRoot = path.join(repoRoot, "course", args.course, "modules", args.module, "lessons");
  const entries = (await listDirSafe(lessonsRoot)).filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    console.error(`No lessons found at ${path.relative(repoRoot, lessonsRoot)}`);
    process.exit(2);
  }

  const rows = [];
  for (const ent of entries) {
    const metaPath = path.join(lessonsRoot, ent.name, "lesson.meta.json");
    const meta = await readJsonSafe(metaPath);
    if (!meta) {
      rows.push({
        id: ent.name,
        title: null,
        description: null,
        videoCount: 0,
        videos: [],
        missingMeta: true,
        mockTestSection: null,
      });
      continue;
    }
    if (meta.mockTestSection) continue;

    const videos = Array.isArray(meta.videos) ? meta.videos : [];
    rows.push({
      id: meta.id || ent.name,
      title: meta.title ?? null,
      description: typeof meta.description === "string" ? meta.description : null,
      videoCount: videos.length,
      videos,
      missingMeta: false,
      mockTestSection: null,
    });
  }

  const filtered = args.missingOnly ? rows.filter((r) => r.videoCount === 0) : rows;

  if (args.format === "json") {
    console.log(JSON.stringify({
      course: args.course,
      module: args.module,
      total: rows.length,
      listed: filtered.length,
      lessons: filtered,
    }, null, 2));
    return;
  }

  const withVideos = rows.filter((r) => r.videoCount > 0).length;
  console.log(`# ${args.course} / ${args.module}`);
  console.log(`Lessons: ${rows.length} · with videos: ${withVideos} · missing: ${rows.length - withVideos}`);
  console.log("");
  for (const row of filtered) {
    const flag = row.missingMeta ? "ERR" : row.videoCount > 0 ? "OK" : "MISSING";
    console.log(`- [${flag}] ${row.id}`);
    if (row.title) console.log(`  title: ${row.title}`);
    if (row.description) console.log(`  description: ${row.description}`);
    if (row.videoCount > 0) {
      for (const v of row.videos) {
        const views = typeof v.views === "number" ? ` (${v.views} views)` : "";
        console.log(`  - ${v.title || "(untitled)"}${views}`);
        console.log(`    ${v.url}`);
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
