import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { generateContentMap } from "../../scripts/graph/generate-content-map.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

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

test("generateContentMap reports exists and planned per course", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), path.join(tmpDir, "course"), {
      recursive: true,
    });

    const map = await generateContentMap({ repoRoot: tmpDir });
    assert.ok(map.courses.javascript);
    const courseMap = map.courses.javascript;
    const exists = courseMap.entries.filter((e) => e.status === "exists");
    const planned = courseMap.entries.filter((e) => e.status === "planned");

    assert.ok(exists.some((e) => e.graphIndex === "01.1.1"));
    assert.ok(planned.some((e) => e.graphIndex === "01.1.2"));
    assert.equal(courseMap.exists, exists.length);
    assert.ok(courseMap.planned >= 1);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("generateContentMap isolates colliding graphIndex across courses", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    setupMiniGraph(tmpDir, "course-b");

    cpSync(path.join(repoRoot, "tests/fixtures/mini-course"), path.join(tmpDir, "course"), {
      recursive: true,
    });

    // Second course with same graphIndex 01.1.1 but different lesson id
    const courseB = path.join(tmpDir, "course", "course-b");
    mkdirSync(path.join(courseB, "modules", "01-test-fundamentals", "lessons", "01.1.1-running-code"), {
      recursive: true,
    });
    writeFileSync(
      path.join(courseB, "course.meta.json"),
      JSON.stringify(
        { id: "course-b", title: "Course B", graphRootLabel: "TestLang", graphSlug: "course-b" },
        null,
        2,
      ),
    );
    writeFileSync(
      path.join(courseB, "modules", "01-test-fundamentals", "module.meta.json"),
      JSON.stringify({ id: "01-test-fundamentals", graphIndex: "01", title: "Test" }, null, 2),
    );
    writeFileSync(
      path.join(
        courseB,
        "modules",
        "01-test-fundamentals",
        "lessons",
        "01.1.1-running-code",
        "lesson.meta.json",
      ),
      JSON.stringify(
        {
          id: "01.1.1-running-code",
          graphIndex: "01.1.1",
          title: "Running Code",
          prerequisites: [],
          status: "draft",
        },
        null,
        2,
      ),
    );

    const map = await generateContentMap({ repoRoot: tmpDir });
    assert.ok(map.courses.javascript);
    assert.ok(map.courses["course-b"]);

    const jsEntry = map.courses.javascript.entries.find(
      (e) => e.graphIndex === "01.1.1" && e.status === "exists",
    );
    const bEntry = map.courses["course-b"].entries.find(
      (e) => e.graphIndex === "01.1.1" && e.status === "exists",
    );

    assert.equal(jsEntry.courseId, "javascript");
    assert.equal(bEntry.courseId, "course-b");
    assert.notEqual(jsEntry.diskPath, bEntry.diskPath);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});
