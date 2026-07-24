import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  isMockModuleId,
  validateAllLessonsInGraph,
  validateCourseLessonsInGraph,
} from "../../scripts/graph/validate-lessons-in-graph.mjs";
import { makeTmpDir, cleanupTmpDir } from "../helpers/test-tmp.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scriptPath = path.join(repoRoot, "scripts/graph/validate-lessons-in-graph.mjs");

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

function writeCourseShell(tmpDir, courseSlug, graphSlug = courseSlug) {
  const courseRoot = path.join(tmpDir, "course", courseSlug);
  mkdirSync(courseRoot, { recursive: true });
  writeFileSync(
    path.join(courseRoot, "course.meta.json"),
    JSON.stringify(
      {
        id: courseSlug,
        title: courseSlug,
        graphRootLabel: "TestLang",
        graphSlug,
      },
      null,
      2,
    ),
  );
  return courseRoot;
}

function writeStudyLesson(courseRoot, moduleId, lessonId, meta) {
  const lessonPath = path.join(courseRoot, "modules", moduleId, "lessons", lessonId);
  mkdirSync(lessonPath, { recursive: true });
  writeFileSync(path.join(lessonPath, "lesson.meta.json"), JSON.stringify(meta, null, 2));
  writeFileSync(path.join(lessonPath, "README.md"), `# ${meta.title}\n`);
  return lessonPath;
}

test("isMockModuleId detects -mock suffix", () => {
  assert.equal(isMockModuleId("01-javascript-fundamentals-mock"), true);
  assert.equal(isMockModuleId("01-javascript-fundamentals"), false);
});

test("validateCourseLessonsInGraph passes when study lessons match graph leaves", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    const { loadGraph, findNodeByIndex } = await import("../../scripts/graph/graph-index.mjs");
    const graph = loadGraph({ repoRoot: tmpDir, courseSlug: "javascript" });
    const node = findNodeByIndex(graph, "01.1.1");
    writeStudyLesson(courseRoot, "01-test-fundamentals", "01.1.1-running-code", {
      id: "01.1.1-running-code",
      graphIndex: "01.1.1",
      graphNodeId: node.id,
      title: "Running Code",
    });

    const report = await validateCourseLessonsInGraph(tmpDir, "javascript");
    assert.equal(report.ok, true);
    assert.equal(report.checked, 1);
    assert.equal(report.findings.length, 0);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("validateCourseLessonsInGraph fails when lesson graphIndex is missing from graph", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    writeStudyLesson(courseRoot, "01-test-fundamentals", "09.9.9-ghost-lesson", {
      id: "09.9.9-ghost-lesson",
      graphIndex: "09.9.9",
      graphNodeId: "n_missing",
      title: "Ghost Lesson",
    });

    const report = await validateCourseLessonsInGraph(tmpDir, "javascript");
    assert.equal(report.ok, false);
    assert.equal(report.checked, 1);
    assert.ok(report.findings.some((f) => /not found in graph/.test(f.message)));
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("validateCourseLessonsInGraph skips -mock modules", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    writeStudyLesson(courseRoot, "01-test-fundamentals-mock", "01.1-test-instructions", {
      id: "01.1-test-instructions",
      graphIndex: "01.1",
      title: "Test Instructions",
      mockTestSection: "instructions",
    });

    const report = await validateCourseLessonsInGraph(tmpDir, "javascript");
    assert.equal(report.ok, true);
    assert.equal(report.checked, 0);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("validateCourseLessonsInGraph fails when graphIndex is a non-leaf", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    writeStudyLesson(courseRoot, "01-test-fundamentals", "01.1-getting-started", {
      id: "01.1-getting-started",
      graphIndex: "01.1",
      graphNodeId: "n_anything",
      title: "Getting Started",
    });

    const report = await validateCourseLessonsInGraph(tmpDir, "javascript");
    assert.equal(report.ok, false);
    assert.ok(report.findings.some((f) => /not a leaf node/.test(f.message)));
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("graphNodeId drift is a warning unless --strict", async () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    writeStudyLesson(courseRoot, "01-test-fundamentals", "01.1.1-running-code", {
      id: "01.1.1-running-code",
      graphIndex: "01.1.1",
      graphNodeId: "n_stale",
      title: "Running Code",
    });

    const soft = await validateCourseLessonsInGraph(tmpDir, "javascript", { strict: false });
    assert.equal(soft.ok, true);
    assert.equal(soft.warnings, 1);

    const hard = await validateCourseLessonsInGraph(tmpDir, "javascript", { strict: true });
    assert.equal(hard.ok, false);
    assert.equal(hard.errors, 1);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("CLI exits 1 when a study lesson is missing from the graph", () => {
  const tmpDir = makeTmpDir();
  try {
    setupMiniGraph(tmpDir, "javascript");
    const courseRoot = writeCourseShell(tmpDir, "javascript");
    writeStudyLesson(courseRoot, "01-test-fundamentals", "09.9.9-ghost-lesson", {
      id: "09.9.9-ghost-lesson",
      graphIndex: "09.9.9",
      graphNodeId: "n_missing",
      title: "Ghost Lesson",
    });

    let exitCode = 0;
    try {
      execFileSync("node", [scriptPath, "--course", "javascript", "--repo-root", tmpDir], {
        cwd: repoRoot,
        encoding: "utf8",
      });
    } catch (err) {
      exitCode = err.status;
    }
    assert.equal(exitCode, 1);
  } finally {
    cleanupTmpDir(tmpDir);
  }
});

test("CLI passes on real javascript course (presence check)", () => {
  const out = execFileSync("node", [scriptPath, "--course", "javascript"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  assert.match(out, /OK javascript/);
});

test("validateAllLessonsInGraph covers every course slug", async () => {
  const report = await validateAllLessonsInGraph({ repoRoot });
  assert.ok(report.checked > 0);
  assert.ok(report.courses.some((c) => c.courseSlug === "javascript"));
  assert.equal(report.ok, true, JSON.stringify(report.findings.filter((f) => f.level === "error"), null, 2));
});
