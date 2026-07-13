#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadGraph,
  extractIndexPath,
  isLeafNode,
  listCourseSlugs,
} from "./graph-index.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const outPath = path.join(repoRoot, "graph/content-map.json");

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

/** Scan lessons for one course. */
export async function scanCourseLessons(root, courseSlug) {
  const byGraphIndex = new Map();
  const orphans = [];
  const modulesPath = path.join(root, "course", courseSlug, "modules");
  const moduleEntries = await listDirSafe(modulesPath);

  for (const modEnt of moduleEntries.filter((e) => e.isDirectory())) {
    const lessonsPath = path.join(modulesPath, modEnt.name, "lessons");
    const lessonEntries = await listDirSafe(lessonsPath);

    for (const lessonEnt of lessonEntries.filter((e) => e.isDirectory())) {
      const lessonPath = path.join(lessonsPath, lessonEnt.name);
      const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
      const graphIndex = meta?.graphIndex ?? extractIndexPath(lessonEnt.name);

      const entry = {
        graphIndex,
        courseId: courseSlug,
        moduleId: modEnt.name,
        lessonId: lessonEnt.name,
        diskPath: path.relative(root, lessonPath),
        status: "exists",
      };

      if (graphIndex) {
        byGraphIndex.set(graphIndex, entry);
      } else {
        orphans.push({ ...entry, status: "orphan", reason: "missing graphIndex" });
      }
    }
  }

  return { byGraphIndex, orphans };
}

export async function generateCourseContentMap(root, courseSlug) {
  const graph = loadGraph({ repoRoot: root, courseSlug });
  const { byGraphIndex, orphans } = await scanCourseLessons(root, courseSlug);
  const entries = [];
  const remaining = new Map(byGraphIndex);

  for (const node of graph.nodes || []) {
    if (!isLeafNode(graph, node.id)) continue;
    const graphIndex = extractIndexPath(node.label);
    if (!graphIndex) continue;

    const existing = remaining.get(graphIndex);
    if (existing) {
      entries.push(existing);
      remaining.delete(graphIndex);
    } else {
      entries.push({
        graphIndex,
        courseId: courseSlug,
        moduleId: null,
        lessonId: null,
        diskPath: null,
        status: "planned",
        title: node.label,
      });
    }
  }

  for (const [, leftover] of remaining) {
    entries.push({ ...leftover, status: "orphan", reason: "no matching graph leaf" });
  }
  entries.push(...orphans);

  entries.sort((a, b) => (a.graphIndex || "").localeCompare(b.graphIndex || "", "en", { numeric: true }));

  return {
    courseSlug,
    total: entries.length,
    exists: entries.filter((e) => e.status === "exists").length,
    planned: entries.filter((e) => e.status === "planned").length,
    orphan: entries.filter((e) => e.status === "orphan").length,
    entries,
  };
}

export async function generateContentMap(options = {}) {
  const root = options.repoRoot ?? repoRoot;
  const courseSlugs = options.courseSlugs ?? listCourseSlugs(root);
  const courses = {};

  for (const courseSlug of courseSlugs) {
    courses[courseSlug] = await generateCourseContentMap(root, courseSlug);
  }

  return {
    generatedAt: new Date().toISOString(),
    courses,
  };
}

async function main() {
  const map = await generateContentMap();
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(map, null, 2) + "\n", "utf8");
  process.stdout.write(`Wrote ${outPath}\n`);
  for (const [slug, courseMap] of Object.entries(map.courses)) {
    process.stdout.write(
      `${slug}: exists=${courseMap.exists}, planned=${courseMap.planned}, orphan=${courseMap.orphan}\n`,
    );
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    process.stderr.write(String(err?.stack || err) + "\n");
    process.exit(1);
  });
}
