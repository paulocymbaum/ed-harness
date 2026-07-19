import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  isSafeCourseRelPath,
  parseManifest,
  buildManifest,
} from "../../scripts/course-score-archive-lib.mjs";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("course-score-archive-lib", () => {
  it("accepts only score.json and project-delivery.json under course/", () => {
    assert.equal(isSafeCourseRelPath("course/javascript/quiz/score.json"), true);
    assert.equal(
      isSafeCourseRelPath(
        "course/javascript/modules/01-x/lessons/01.1/projects/001-a/project-delivery.json",
      ),
      true,
    );
    assert.equal(isSafeCourseRelPath("course/javascript/quiz/quiz.json"), false);
    assert.equal(isSafeCourseRelPath("../course/javascript/quiz/score.json"), false);
    assert.equal(isSafeCourseRelPath("course/../etc/passwd"), false);
    assert.equal(isSafeCourseRelPath("/tmp/score.json"), false);
  });

  it("parses valid manifests only", () => {
    const ok = buildManifest({
      courseIds: ["javascript"],
      files: ["course/javascript/quiz/score.json"],
    });
    assert.ok(parseManifest(ok));
    assert.equal(parseManifest({ kind: "other", version: 1, courses: [], files: [] }), null);
  });
});

describe("extract/restore course score scripts", () => {
  it("extracts javascript progress and dry-run restore matches file list", async () => {
    const scorePath = path.join(repoRoot, "course/javascript/quiz/score.json");
    try {
      await fs.access(scorePath);
    } catch {
      return;
    }

    const tmpRoot = await fs.mkdtemp(path.join(repoRoot, "tmp-score-archive-"));
    const outZip = path.join(tmpRoot, "out.zip");
    const extractScript = path.join(repoRoot, "scripts/extract-course-score.mjs");
    const restoreScript = path.join(repoRoot, "scripts/restore-course-score.mjs");

    try {
      const { stdout: extractOut } = await execFileAsync(
        "node",
        [extractScript, "--course", "javascript", "--out", outZip, "--json"],
        { cwd: repoRoot },
      );
      const extracted = JSON.parse(extractOut);
      assert.ok(extracted.fileCount >= 1);
      assert.ok(extracted.files.some((f) => f.endsWith("quiz/score.json")));

      const { stdout: dryOut } = await execFileAsync(
        "node",
        [restoreScript, outZip, "--dry-run", "--json"],
        { cwd: repoRoot },
      );
      const dry = JSON.parse(dryOut);
      assert.equal(dry.dryRun, true);
      assert.equal(dry.fileCount, extracted.fileCount);
      assert.deepEqual(dry.written, []);
    } finally {
      await fs.rm(tmpRoot, { recursive: true, force: true });
    }
  });
});
