#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadGraph,
  extractIndexPath,
  stripIndexPrefix,
  isLeafNode,
  getChildren,
  listCourseSlugs,
} from "./graph-index.mjs";
import { scanCourseLessons } from "./generate-content-map.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..");
const graphBundleOutPath = path.join(repoRoot, "graph/content-graphs.json");
const frontendBundleOutPath = path.join(
  repoRoot,
  "frontend/src/infrastructure/static/content-graphs.json",
);

function classifyNodeKind(graph, nodeId, graphIndex) {
  if (nodeId === graph.rootId) return "root";
  if (isLeafNode(graph, nodeId)) return "lesson";
  if (graphIndex && !graphIndex.includes(".")) return "module";
  return "section";
}

function sortNodesByIndex(nodes) {
  return [...nodes].sort((a, b) => {
    const ai = extractIndexPath(a.label) || "";
    const bi = extractIndexPath(b.label) || "";
    return ai.localeCompare(bi, "en", { numeric: true });
  });
}

function buildTreeNode(graph, rawNode, byGraphIndex) {
  const graphIndex = extractIndexPath(rawNode.label);
  const kind = classifyNodeKind(graph, rawNode.id, graphIndex);
  const childIds = getChildren(graph, rawNode.id);
  const childNodes = sortNodesByIndex(
    childIds
      .map((id) => (graph.nodes || []).find((n) => n.id === id))
      .filter(Boolean),
  );

  const node = {
    id: rawNode.id,
    graphIndex,
    label: stripIndexPrefix(rawNode.label) || rawNode.label,
    kind,
    children: childNodes.map((child) => buildTreeNode(graph, child, byGraphIndex)),
  };

  if (kind === "lesson" && graphIndex) {
    const disk = byGraphIndex.get(graphIndex);
    if (disk) {
      node.status = "exists";
      node.catalogRef = {
        courseId: disk.courseId,
        moduleId: disk.moduleId,
        lessonId: disk.lessonId,
      };
    } else {
      node.status = "planned";
    }
  }

  return node;
}

function countLeafStats(node) {
  let totalLeaves = 0;
  let exists = 0;
  let planned = 0;
  let orphan = 0;

  function walk(n) {
    if (n.kind === "lesson") {
      totalLeaves += 1;
      if (n.status === "exists") exists += 1;
      else if (n.status === "planned") planned += 1;
      else if (n.status === "orphan") orphan += 1;
    }
    for (const child of n.children || []) walk(child);
  }

  walk(node);
  return { totalLeaves, exists, planned, orphan };
}

export async function generateCourseContentGraph(root, courseSlug) {
  const graph = loadGraph({ repoRoot: root, courseSlug });
  const { byGraphIndex } = await scanCourseLessons(root, courseSlug);

  const rootRaw = (graph.nodes || []).find((n) => n.id === graph.rootId);
  if (!rootRaw) {
    throw new Error(`Graph root node not found for course ${courseSlug}`);
  }

  const treeRoot = buildTreeNode(graph, rootRaw, byGraphIndex);
  const stats = countLeafStats(treeRoot);

  return {
    generatedAt: new Date().toISOString(),
    courseSlug,
    stats,
    root: treeRoot,
  };
}

export async function generateContentGraph(options = {}) {
  const root = options.repoRoot ?? repoRoot;
  const courseSlugs = options.courseSlugs ?? listCourseSlugs(root);
  const courses = {};

  for (const courseSlug of courseSlugs) {
    courses[courseSlug] = await generateCourseContentGraph(root, courseSlug);
  }

  return {
    generatedAt: new Date().toISOString(),
    courses,
  };
}

async function writeJson(outPath, data) {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  process.stdout.write(`Wrote ${outPath}\n`);
}

async function main() {
  const bundle = await generateContentGraph();
  await writeJson(graphBundleOutPath, bundle);
  await writeJson(frontendBundleOutPath, bundle);

  for (const [slug, graph] of Object.entries(bundle.courses)) {
    process.stdout.write(
      `${slug}: exists=${graph.stats.exists}, planned=${graph.stats.planned}, orphan=${graph.stats.orphan}\n`,
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
