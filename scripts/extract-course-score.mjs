#!/usr/bin/env node
/**
 * Zip course scores and project delivery results into a portable archive.
 *
 * Collects course/<courseId>/quiz/score.json and every project-delivery.json
 * under the selected course tree.
 *
 * Usage:
 *   node scripts/extract-course-score.mjs
 *   node scripts/extract-course-score.mjs --course javascript
 *   node scripts/extract-course-score.mjs --course javascript --out ./backup.zip
 *   node scripts/extract-course-score.mjs --all --json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildManifest,
  collectProgressFiles,
  defaultArchiveName,
  listCourseIds,
  zipFiles,
} from "./course-score-archive-lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function printUsage() {
  process.stderr.write(`Usage:
  node scripts/extract-course-score.mjs [--course <id>] [--all] [--out <file.zip>] [--json]

Options:
  --course <id>   Course slug under course/ (repeatable). Default: all courses with progress.
  --all           Explicitly include every course folder.
  --out <path>    Output zip path (default: course-scores-<label>-<timestamp>.zip in repo root).
  --json          Print machine-readable summary on stdout.
`);
}

function parseArgs(argv) {
  const courseIds = [];
  let out = null;
  let all = false;
  let json = false;
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--all") {
      all = true;
    } else if (arg === "--json") {
      json = true;
    } else if (arg === "--course") {
      const value = argv[++i];
      if (!value || value.startsWith("-")) {
        throw new Error("--course requires a course id");
      }
      courseIds.push(value);
    } else if (arg === "--out") {
      const value = argv[++i];
      if (!value || value.startsWith("-")) {
        throw new Error("--out requires a path");
      }
      out = value;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { courseIds, out, all, json, help };
}

async function resolveCourseIds(requested, all) {
  const available = await listCourseIds(path.join(repoRoot, "course"));
  if (all || requested.length === 0) {
    return available;
  }

  const missing = requested.filter((id) => !available.includes(id));
  if (missing.length > 0) {
    throw new Error(`Unknown course id(s): ${missing.join(", ")}`);
  }
  return [...new Set(requested)].sort();
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n\n`);
    printUsage();
    process.exit(2);
  }

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const courseIds = await resolveCourseIds(args.courseIds, args.all);
  const files = await collectProgressFiles(repoRoot, courseIds);

  if (files.length === 0) {
    process.stderr.write("No score.json or project-delivery.json files found for the selected courses.\n");
    process.exit(1);
  }

  const outPath = args.out
    ? path.resolve(process.cwd(), args.out)
    : path.join(
        repoRoot,
        defaultArchiveName(args.courseIds.length > 0 ? args.courseIds : courseIds),
      );

  const manifest = buildManifest({ courseIds, files });
  await zipFiles(repoRoot, files, outPath, manifest);

  const summary = {
    out: outPath,
    courses: courseIds,
    fileCount: files.length,
    files,
  };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    process.stdout.write(`Wrote ${files.length} file(s) → ${outPath}\n`);
    for (const file of files) {
      process.stdout.write(`  ${file}\n`);
    }
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
