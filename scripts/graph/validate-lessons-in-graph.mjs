#!/usr/bin/env node
/**
 * Validate that every study lesson on disk is present as a leaf in its course graph.
 *
 * Skips modules whose id ends with `-mock` (mock sections are not graph leaves).
 *
 * Usage:
 *   node scripts/graph/validate-lessons-in-graph.mjs
 *   node scripts/graph/validate-lessons-in-graph.mjs --course javascript
 *   node scripts/graph/validate-lessons-in-graph.mjs --strict
 *   node scripts/graph/validate-lessons-in-graph.mjs --repo-root /path/to/repo
 *
 * Exit code 1 if any study lesson is missing from the graph, has no graphIndex,
 * or points at a non-leaf. With --strict, mismatched graphNodeId also fails.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadGraph,
  findNodeByIndex,
  isLeafNode,
  extractIndexPath,
  listCourseSlugs,
} from "./graph-index.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(scriptDir, "..", "..");

export function isMockModuleId(moduleId) {
  return typeof moduleId === "string" && moduleId.endsWith("-mock");
}

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function parseArgs(argv) {
  const args = { course: null, json: false, repoRoot: null, strict: false, help: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i];
    else if (arg === "--repo-root") args.repoRoot = argv[++i];
    else if (arg === "--json") args.json = true;
    else if (arg === "--strict") args.strict = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

/**
 * Scan study lessons (non-mock) for one course.
 * @returns {Promise<Array<{ courseSlug, moduleId, lessonId, diskPath, meta }>>}
 */
export async function collectStudyLessons(root, courseSlug) {
  const lessons = [];
  const modulesPath = path.join(root, "course", courseSlug, "modules");
  const moduleEntries = await listDirSafe(modulesPath);

  for (const modEnt of moduleEntries.filter((e) => e.isDirectory())) {
    if (isMockModuleId(modEnt.name)) continue;

    const lessonsPath = path.join(modulesPath, modEnt.name, "lessons");
    const lessonEntries = await listDirSafe(lessonsPath);

    for (const lessonEnt of lessonEntries.filter((e) => e.isDirectory())) {
      const lessonPath = path.join(lessonsPath, lessonEnt.name);
      const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
      lessons.push({
        courseSlug,
        moduleId: modEnt.name,
        lessonId: lessonEnt.name,
        diskPath: path.relative(root, lessonPath),
        meta,
      });
    }
  }

  return lessons;
}

/**
 * @param {{ meta, lessonId, diskPath }} lesson
 * @param {object} graph
 * @param {{ strict?: boolean }} [options]
 */
export function validateLessonAgainstGraph(lesson, graph, options = {}) {
  const findings = [];
  const { diskPath, meta, lessonId } = lesson;
  const strict = Boolean(options.strict);

  if (!meta || typeof meta !== "object") {
    findings.push({
      level: "error",
      diskPath,
      message: "lesson.meta.json missing or invalid",
    });
    return findings;
  }

  const graphIndex = meta.graphIndex ?? extractIndexPath(lessonId);
  if (!graphIndex) {
    findings.push({
      level: "error",
      diskPath,
      message: "missing graphIndex (meta and folder name)",
    });
    return findings;
  }

  const node = findNodeByIndex(graph, graphIndex);
  if (!node) {
    findings.push({
      level: "error",
      diskPath,
      message: `graphIndex "${graphIndex}" not found in graph`,
    });
    return findings;
  }

  if (!isLeafNode(graph, node.id)) {
    findings.push({
      level: "error",
      diskPath,
      message: `graphIndex "${graphIndex}" is not a leaf node (${node.label})`,
    });
  }

  if (meta.graphNodeId && meta.graphNodeId !== node.id) {
    findings.push({
      level: strict ? "error" : "warn",
      diskPath,
      message: `graphNodeId "${meta.graphNodeId}" does not match graph node "${node.id}" for ${graphIndex}`,
    });
  }

  return findings;
}

function summarize(courseSlug, checked, findings) {
  const errors = findings.filter((f) => f.level === "error");
  return {
    courseSlug,
    checked,
    findings,
    errors: errors.length,
    warnings: findings.length - errors.length,
    ok: errors.length === 0,
  };
}

export async function validateCourseLessonsInGraph(root, courseSlug, options = {}) {
  const graph = loadGraph({ repoRoot: root, courseSlug });
  const lessons = await collectStudyLessons(root, courseSlug);
  const findings = [];

  for (const lesson of lessons) {
    findings.push(...validateLessonAgainstGraph(lesson, graph, options));
  }

  return summarize(courseSlug, lessons.length, findings);
}

export async function validateAllLessonsInGraph(options = {}) {
  const root = options.repoRoot ?? defaultRepoRoot;
  const courseSlugs = options.courseSlug
    ? [options.courseSlug]
    : options.courseSlugs ?? listCourseSlugs(root);

  const courses = [];
  for (const courseSlug of courseSlugs) {
    courses.push(await validateCourseLessonsInGraph(root, courseSlug, options));
  }

  const findings = courses.flatMap((c) =>
    c.findings.map((f) => ({ ...f, courseSlug: c.courseSlug })),
  );
  const errors = findings.filter((f) => f.level === "error");

  return {
    courses,
    checked: courses.reduce((n, c) => n + c.checked, 0),
    findings,
    errors: errors.length,
    warnings: findings.length - errors.length,
    ok: errors.length === 0,
  };
}

function usage() {
  return [
    "Usage: node scripts/graph/validate-lessons-in-graph.mjs [--course <slug>] [--repo-root <path>] [--strict] [--json]",
    "",
    "Checks that every study lesson under course/<slug>/modules/*/lessons/",
    "has a graphIndex that resolves to a leaf in graph/courses/<slug>.graph.*",
    "Modules ending in -mock are skipped.",
    "",
    "Exit 1 on missing / non-leaf graphIndex. --strict also fails on graphNodeId drift.",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
  }

  const report = await validateAllLessonsInGraph({
    repoRoot: args.repoRoot ? path.resolve(args.repoRoot) : defaultRepoRoot,
    courseSlug: args.course,
    strict: args.strict,
  });

  if (args.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    for (const f of report.findings) {
      const prefix = f.level === "error" ? "ERROR" : "WARN";
      process.stdout.write(`${prefix} ${f.diskPath}: ${f.message}\n`);
    }
    for (const c of report.courses) {
      const status = c.ok ? "OK" : "FAIL";
      process.stdout.write(
        `${status} ${c.courseSlug}: ${c.checked} study lesson(s) checked, ${c.errors} error(s), ${c.warnings} warning(s)\n`,
      );
    }
    process.stdout.write(
      `Summary: ${report.checked} lesson(s), ${report.errors} error(s), ${report.warnings} warning(s)\n`,
    );
  }

  process.exit(report.ok ? 0 : 1);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    process.stderr.write(`${String(err?.stack || err)}\n`);
    process.exit(1);
  });
}
