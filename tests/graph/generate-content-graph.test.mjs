import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { generateContentGraph } from "../../scripts/graph/generate-content-graph.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function collectLeaves(node) {
  if (node.kind === "lesson") return [node];
  return (node.children || []).flatMap(collectLeaves);
}

function setupMiniGraph(tmpDir, graphSlug = "javascript") {
  const coursesDir = path.join(tmpDir, "graph", "courses");
  mkdirSync(coursesDir, { recursive: true });
  const txtPath = path.join(coursesDir, `${graphSlug}.graph.txt`);
  cpSync(path.join(repoRoot, "tests/fixtures/mini-graph.txt"), txtPath);
  execFileSync("node", [
    path.join(repoRoot, "scripts/graph/renderTxtToJson.js"),
    txtPath,
    path.join(coursesDir, `${graphSlug}.graph.json`),
  ]);
}

test("generateContentGraph builds nested tree with exists and planned leaves", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), path.join(tmpDir, "course"), {
      recursive: true,
    });

    const bundle = await generateContentGraph({ repoRoot: tmpDir });
    assert.ok(bundle.courses.javascript);
    const graph = bundle.courses.javascript;

    assert.equal(graph.root.kind, "root");
    assert.ok(graph.root.children.length >= 1);
    assert.equal(graph.root.children[0].kind, "module");

    const leaves = collectLeaves(graph.root);
    assert.ok(leaves.some((l) => l.graphIndex === "01.1.1" && l.status === "exists"));
    assert.ok(leaves.some((l) => l.graphIndex === "01.1.2" && l.status === "planned"));
    assert.ok(leaves.find((l) => l.graphIndex === "01.1.1")?.catalogRef?.lessonId);
    assert.equal(graph.stats.exists, leaves.filter((l) => l.status === "exists").length);
    assert.equal(graph.stats.planned, leaves.filter((l) => l.status === "planned").length);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
