import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const SCORE_FILENAME = "score.json";
export const PROJECT_DELIVERY_FILENAME = "project-delivery.json";
export const MANIFEST_FILENAME = "manifest.json";
export const ARCHIVE_KIND = "ed-harness-course-scores";
export const ARCHIVE_VERSION = 1;

export function isSafeCourseRelPath(relPath) {
  if (typeof relPath !== "string" || !relPath) return false;
  const normalized = relPath.replace(/\\/g, "/");
  if (normalized.includes("\0")) return false;
  if (path.isAbsolute(normalized)) return false;
  if (normalized.split("/").some((part) => part === "..")) return false;
  if (!normalized.startsWith("course/")) return false;

  const base = path.posix.basename(normalized);
  if (base === SCORE_FILENAME) {
    return /\/quiz\/score\.json$/.test(normalized);
  }
  if (base === PROJECT_DELIVERY_FILENAME) {
    return normalized.endsWith(`/${PROJECT_DELIVERY_FILENAME}`);
  }
  return false;
}

export async function listCourseIds(courseRoot) {
  const entries = await fs.readdir(courseRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
}

async function walkFiles(dir, visitor) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return;
    throw err;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(full, visitor);
    } else if (entry.isFile()) {
      await visitor(full);
    }
  }
}

/**
 * Collect learner progress files under course/ (score.json + project-delivery.json).
 * @returns {Promise<string[]>} paths relative to repoRoot, posix-style
 */
export async function collectProgressFiles(repoRoot, courseIds) {
  const courseRoot = path.join(repoRoot, "course");
  const wanted = new Set(courseIds);
  const files = [];

  for (const courseId of wanted) {
    const coursePath = path.join(courseRoot, courseId);
    const scoreRel = path.posix.join("course", courseId, "quiz", SCORE_FILENAME);
    const scoreAbs = path.join(repoRoot, ...scoreRel.split("/"));
    try {
      await fs.access(scoreAbs);
      files.push(scoreRel);
    } catch {
      // optional
    }

    await walkFiles(coursePath, async (absPath) => {
      if (path.basename(absPath) !== PROJECT_DELIVERY_FILENAME) return;
      const rel = path.relative(repoRoot, absPath).split(path.sep).join("/");
      if (isSafeCourseRelPath(rel)) files.push(rel);
    });
  }

  return files.sort();
}

export function buildManifest({ courseIds, files, createdAt = new Date().toISOString() }) {
  return {
    kind: ARCHIVE_KIND,
    version: ARCHIVE_VERSION,
    createdAt,
    courses: courseIds,
    files,
  };
}

export function parseManifest(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!data || typeof data !== "object") return null;
  if (data.kind !== ARCHIVE_KIND) return null;
  if (data.version !== ARCHIVE_VERSION) return null;
  if (!Array.isArray(data.courses) || !Array.isArray(data.files)) return null;
  if (!data.files.every((f) => typeof f === "string")) return null;
  return data;
}

export async function zipFiles(repoRoot, files, outZipPath, manifest) {
  const stagingDir = await fs.mkdtemp(path.join(path.dirname(outZipPath), ".course-score-"));
  try {
    await fs.writeFile(
      path.join(stagingDir, MANIFEST_FILENAME),
      JSON.stringify(manifest, null, 2) + "\n",
      "utf8",
    );

    for (const rel of files) {
      const src = path.join(repoRoot, ...rel.split("/"));
      const dest = path.join(stagingDir, ...rel.split("/"));
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(src, dest);
    }

    await fs.mkdir(path.dirname(outZipPath), { recursive: true });
    try {
      await fs.unlink(outZipPath);
    } catch {
      // ok if missing
    }

    const args = ["-r", outZipPath, MANIFEST_FILENAME];
    if (files.length > 0) args.push("course");
    await execFileAsync("zip", args, { cwd: stagingDir });
  } finally {
    await fs.rm(stagingDir, { recursive: true, force: true });
  }
}

export async function listZipEntries(zipPath) {
  const { stdout } = await execFileAsync("unzip", ["-Z1", zipPath]);
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/\\/g, "/"));
}

export async function readZipText(zipPath, entryName) {
  const { stdout } = await execFileAsync("unzip", ["-p", zipPath, entryName], {
    maxBuffer: 32 * 1024 * 1024,
    encoding: "utf8",
  });
  return stdout;
}

export async function extractZipEntryToFile(zipPath, entryName, destAbs) {
  await fs.mkdir(path.dirname(destAbs), { recursive: true });
  const { stdout } = await execFileAsync("unzip", ["-p", zipPath, entryName], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: "buffer",
  });
  await fs.writeFile(destAbs, stdout);
}

export function defaultArchiveName(courseIds) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
  const label = courseIds.length === 1 ? courseIds[0] : "all";
  return `course-scores-${label}-${stamp}.zip`;
}
