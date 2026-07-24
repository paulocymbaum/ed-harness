import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isLearnerProgressPath,
  isSecretEnvPath,
  shouldSyncPath,
} from "../../scripts/sync-to-ed-harness.mjs";

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
  assert.equal(isSecretEnvPath(".env.local"), true);
  assert.equal(isSecretEnvPath(".env.example"), false);
});

test("shouldSyncPath drops progress, secrets, and build artifacts", () => {
  assert.equal(shouldSyncPath("course/javascript/quiz/score.json"), false);
  assert.equal(shouldSyncPath("backup.zip"), false);
  assert.equal(shouldSyncPath("EdHarness"), false);
  assert.equal(shouldSyncPath(".env"), false);
  assert.equal(shouldSyncPath("frontend/node_modules/left-pad/index.js"), false);
  assert.equal(shouldSyncPath("frontend/src/App.tsx"), true);
  assert.equal(shouldSyncPath(".env.example"), true);
  assert.equal(shouldSyncPath("graph/courses/javascript.graph.txt"), true);
  assert.equal(
    shouldSyncPath(
      "course/javascript/modules/01-javascript-fundamentals/lessons/01.9.3-array-prototype-filter/README.md",
    ),
    true,
  );
});
