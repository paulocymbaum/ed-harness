#!/usr/bin/env node
/**
 * Unzip a course-scores archive and replace score/delivery files in place.
 *
 * Only writes course/<courseId>/quiz/score.json and project-delivery.json
 * paths under course/ (rejects path traversal and unrelated entries).
 *
 * Usage:
 *   node scripts/restore-course-score.mjs ./course-scores-javascript-….zip
 *   node scripts/restore-course-score.mjs ./backup.zip --dry-run
 *   node scripts/restore-course-score.mjs ./backup.zip --json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractZipEntryToFile,
  isSafeCourseRelPath,
  listZipEntries,
  MANIFEST_FILENAME,
  parseManifest,
  readZipText,
} from "./course-score-archive-lib.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

function printUsage() {
  process.stderr.write(`Usage:
  node scripts/restore-course-score.mjs <archive.zip> [--dry-run] [--json]

Options:
  --dry-run   List files that would be restored without writing.
  --json      Print machine-readable summary on stdout.
`);
}

function parseArgs(argv) {
  let archive = null;
  let dryRun = false;
  let json = false;
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      help = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--json") {
      json = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown argument: ${arg}`);
    } else if (archive) {
      throw new Error(`Unexpected argument: ${arg}`);
    } else {
      archive = arg;
    }
  }

  return { archive, dryRun, json, help };
}

async function resolveRestorableEntries(zipPath) {
  const entries = await listZipEntries(zipPath);
  let manifest = null;

  if (entries.includes(MANIFEST_FILENAME)) {
    const raw = await readZipText(zipPath, MANIFEST_FILENAME);
    manifest = parseManifest(raw);
    if (!manifest) {
      throw new Error("Invalid manifest.json in archive");
    }
  }

  const candidates = manifest
    ? manifest.files
    : entries.filter((entry) => entry !== MANIFEST_FILENAME);

  const files = [];
  const rejected = [];

  for (const rel of candidates) {
    const normalized = rel.replace(/\\/g, "/");
    if (!isSafeCourseRelPath(normalized)) {
      rejected.push(normalized);
      continue;
    }
    if (!entries.includes(normalized)) {
      rejected.push(normalized);
      continue;
    }
    files.push(normalized);
  }

  return { manifest, files: files.sort(), rejected };
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

  if (!args.archive) {
    printUsage();
    process.exit(2);
  }

  const zipPath = path.resolve(process.cwd(), args.archive);
  try {
    await fs.access(zipPath);
  } catch {
    process.stderr.write(`Archive not found: ${zipPath}\n`);
    process.exit(1);
  }

  const { manifest, files, rejected } = await resolveRestorableEntries(zipPath);

  if (files.length === 0) {
    process.stderr.write("No restorable score/delivery files found in archive.\n");
    if (rejected.length > 0) {
      process.stderr.write(`Rejected: ${rejected.join(", ")}\n`);
    }
    process.exit(1);
  }

  const written = [];
  if (!args.dryRun) {
    for (const rel of files) {
      const dest = path.join(repoRoot, ...rel.split("/"));
      await extractZipEntryToFile(zipPath, rel, dest);
      written.push(rel);
    }
  }

  const summary = {
    archive: zipPath,
    dryRun: args.dryRun,
    courses: manifest?.courses ?? [],
    fileCount: files.length,
    files,
    written: args.dryRun ? [] : written,
    rejected,
  };

  if (args.json) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } else {
    const verb = args.dryRun ? "Would restore" : "Restored";
    process.stdout.write(`${verb} ${files.length} file(s) from ${zipPath}\n`);
    for (const file of files) {
      process.stdout.write(`  ${file}\n`);
    }
    if (rejected.length > 0) {
      process.stdout.write(`Skipped ${rejected.length} unsafe/missing entr(y/ies).\n`);
    }
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
