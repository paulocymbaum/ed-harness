import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SYNC_ROOTS,
  isLearnerProgressPath,
  isSecretEnvPath,
  isUnderSyncRoot,
  shouldSyncPath,
  assertSourceHasLessonsAndGraph,
} from "../../scripts/sync-to-notebook.mjs";

test("SYNC_ROOTS are course, graph, frontend", () => {
  assert.deepEqual(SYNC_ROOTS, ["course", "graph", "frontend"]);
});

test("excludes score.json and project-delivery.json", () => {
  assert.equal(isLearnerProgressPath("course/javascript/quiz/score.json"), true);
  assert.equal(
    isLearnerProgressPath(
      "course/javascript/modules/01-x/lessons/01.1/projects/001-a/project-delivery.json",
    ),
    true,
  );
  assert.equal(isLearnerProgressPath("course-scores-javascript-2026.zip"), true);
  assert.equal(isLearnerProgressPath("backup.zip"), true);
  assert.equal(isLearnerProgressPath("course/javascript/modules/01-x/README.md"), false);
});

test("excludes secret env files but keeps .env.example", () => {
  assert.equal(isSecretEnvPath(".env"), true);
  assert.equal(isSecretEnvPath("frontend/.env"), true);
  assert.equal(isSecretEnvPath("frontend/.env.local"), true);
  assert.equal(isSecretEnvPath("frontend/.env.example"), false);
});

test("isUnderSyncRoot only accepts course/graph/frontend", () => {
  assert.equal(isUnderSyncRoot("course/javascript/README.md"), true);
  assert.equal(isUnderSyncRoot("graph/courses/javascript.graph.json"), true);
  assert.equal(isUnderSyncRoot("frontend/src/App.tsx"), true);
  assert.equal(isUnderSyncRoot("scripts/sync-to-notebook.mjs"), false);
  assert.equal(isUnderSyncRoot("package.json"), false);
  assert.equal(isUnderSyncRoot("landing_page/index.html"), false);
});

test("shouldSyncPath only keeps allowed roots and drops progress/secrets/artifacts", () => {
  assert.equal(shouldSyncPath("course/javascript/quiz/score.json"), false);
  assert.equal(shouldSyncPath("frontend/.env"), false);
  assert.equal(shouldSyncPath("frontend/node_modules/left-pad/index.js"), false);
  assert.equal(shouldSyncPath("frontend/dist/index.html"), false);
  assert.equal(shouldSyncPath("scripts/foo.mjs"), false);
  assert.equal(shouldSyncPath("frontend/src/App.tsx"), true);
  assert.equal(shouldSyncPath("graph/courses/javascript.graph.txt"), true);
  assert.equal(
    shouldSyncPath(
      "course/javascript/modules/01-javascript-fundamentals/lessons/01.9.3-array-prototype-filter/README.md",
    ),
    true,
  );
});

test("progress paths are never sync candidates (leave notebook copies untouched)", () => {
  assert.equal(
    shouldSyncPath(
      "course/javascript/modules/01-x/lessons/01.1/projects/001-a/project-delivery.json",
    ),
    false,
  );
  assert.equal(shouldSyncPath("course/javascript/quiz/score.json"), false);
});

test("assertSourceHasLessonsAndGraph requires graph, lessons, and frontend", () => {
  assert.throws(() => assertSourceHasLessonsAndGraph([]), /graph files missing/);
  assert.throws(
    () =>
      assertSourceHasLessonsAndGraph([
        "graph/courses/javascript.graph.txt",
        "graph/courses/javascript.graph.json",
      ]),
    /no course lesson README/,
  );
  assert.throws(
    () =>
      assertSourceHasLessonsAndGraph([
        "graph/courses/javascript.graph.txt",
        "graph/courses/javascript.graph.json",
        "course/javascript/modules/01-x/lessons/01.1-a/README.md",
      ]),
    /no frontend/,
  );
  const ok = assertSourceHasLessonsAndGraph([
    "graph/courses/javascript.graph.txt",
    "graph/courses/javascript.graph.json",
    "course/javascript/modules/01-x/lessons/01.1-a/README.md",
    "frontend/package.json",
  ]);
  assert.equal(ok.lessonReadmes, 1);
  assert.equal(ok.frontendFiles, 1);
});
