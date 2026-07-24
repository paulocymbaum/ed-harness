#!/usr/bin/env node
/**
 * Sync this repo into paulocymbaum/ed-harness (or EDHARNESS_REPO_URL) on develop.
 *
 * - Clones fresh into a temp directory
 * - Copies repo files from git + ALWAYS walks course/, graph/, and static catalog/graphs on disk
 * - NEVER copies learner progress: score.json, project-delivery.json, course-scores zips
 * - Purges any score/delivery files already present on the destination (git tracked or not)
 * - NEVER copies secrets (.env / .env.*) — only .env.example if present
 * - Commits and pushes to origin/develop (creates develop from default branch if missing)
 * - Auth: GitHub CLI (`gh`) already logged in on this machine
 *
 * Config (NOT committed):
 *   .env  →  EDHARNESS_REPO_URL=https://github.com/<owner>/<repo>
 *           EDHARNESS_BRANCH=develop   (optional, default develop)
 *
 * Usage:
 *   node scripts/sync-to-ed-harness.mjs
 *   node scripts/sync-to-ed-harness.mjs --dry-run
 *   node scripts/sync-to-ed-harness.mjs --skip-push
 *
 * Always deletes the temp clone when finished (success or failure).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const SCORE_BASENAME = "score.json";
const DELIVERY_BASENAME = "project-delivery.json";

/** Directories that must be taken from disk even if git ignore/oddities skip them. */
const FORCE_DISK_ROOTS = [
  "course",
  "graph",
  "frontend/src/infrastructure/static",
];

function parseArgs(argv) {
  const args = {
    dryRun: false,
    skipPush: false,
    message: null,
    help: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--skip-push") args.skipPush = true;
    else if (arg === "--message" || arg === "-m") args.message = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/sync-to-ed-harness.mjs [--dry-run] [--skip-push] [-m msg]",
    "",
    "Requires a local .env (gitignored) with:",
    "  EDHARNESS_REPO_URL=https://github.com/<owner>/<repo>",
    "Optional:",
    "  EDHARNESS_BRANCH=develop",
    "",
    "Pushes with the GitHub CLI. Run `gh auth status` first if unsure.",
  ].join("\n");
}

/** Minimal .env loader — does not override existing process.env. */
export async function loadEnvFile(envPath) {
  let text;
  try {
    text = await fs.readFile(envPath, "utf8");
  } catch (err) {
    if (err && typeof err === "object" && err.code === "ENOENT") return {};
    throw err;
  }

  const loaded = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    loaded[key] = value;
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return loaded;
}

export function isLearnerProgressPath(relPosix) {
  const base = path.posix.basename(relPosix);
  if (base === SCORE_BASENAME) return true;
  if (base === DELIVERY_BASENAME) return true;
  if (/^course-scores-.*\.zip$/i.test(base)) return true;
  if (base === "backup.zip") return true;
  if (relPosix === ".ed-harness-runtime" || relPosix.startsWith(".ed-harness-runtime/")) {
    return true;
  }
  return false;
}

export function isLocalOnlyPath(relPosix) {
  const base = path.posix.basename(relPosix);
  if (base === "EdHarness") return true;
  if (base.endsWith(".code-workspace")) return true;
  return false;
}

export function isSecretEnvPath(relPosix) {
  const base = path.posix.basename(relPosix);
  if (base === ".env.example") return false;
  if (base === ".env") return true;
  if (base.startsWith(".env.")) return true;
  return false;
}

export function isBuildArtifactPath(relPosix) {
  const parts = relPosix.split("/");
  const blockedDirs = new Set([
    "node_modules",
    "dist",
    "build",
    "coverage",
    ".vite",
    ".cache",
    ".git",
    "landing_page",
  ]);
  if (parts.some((p) => blockedDirs.has(p))) return true;
  if (parts.includes(".ed-harness-runtime")) return true;
  return false;
}

export function shouldSyncPath(relPosix) {
  const normalized = relPosix.replace(/\\/g, "/").replace(/^\.\//, "");
  if (!normalized || normalized === ".") return false;
  if (isSecretEnvPath(normalized)) return false;
  if (isLearnerProgressPath(normalized)) return false;
  if (isLocalOnlyPath(normalized)) return false;
  if (isBuildArtifactPath(normalized)) return false;
  return true;
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const err = new Error(
      `${cmd} ${args.join(" ")} failed (${result.status})\n${result.stderr || result.stdout || ""}`,
    );
    err.status = result.status;
    err.stdout = result.stdout;
    err.stderr = result.stderr;
    throw err;
  }
  return result;
}

function runOk(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  return { ok: result.status === 0, ...result };
}

async function walkFiles(absDir, visitor) {
  let entries;
  try {
    entries = await fs.readdir(absDir, { withFileTypes: true });
  } catch (err) {
    if (err && typeof err === "object" && err.code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    const full = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      await walkFiles(full, visitor);
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      await visitor(full);
    }
  }
}

/** Collect every file under the force-disk roots (course, graph, static catalogs). */
export async function listForcedDiskFiles(root) {
  const out = [];
  for (const relRoot of FORCE_DISK_ROOTS) {
    const absRoot = path.join(root, relRoot);
    await walkFiles(absRoot, async (absFile) => {
      const rel = path.relative(root, absFile).replace(/\\/g, "/");
      if (shouldSyncPath(rel)) out.push(rel);
    });
  }
  return out;
}

export async function listSyncFiles(root) {
  const tracked = run("git", ["-C", root, "ls-files", "-z"], { cwd: root });
  const others = run(
    "git",
    ["-C", root, "ls-files", "-z", "--others", "--exclude-standard"],
    { cwd: root },
  );
  const fromGit = `${tracked.stdout || ""}${others.stdout || ""}`
    .split("\0")
    .map((p) => p.replace(/\\/g, "/").trim())
    .filter(Boolean);

  const fromDisk = await listForcedDiskFiles(root);
  const unique = [...new Set([...fromGit, ...fromDisk])];
  return unique.filter(shouldSyncPath).sort();
}

/** Find learner-progress files anywhere under root (for exclude logs + dest purge). */
export async function findProgressFilesOnDisk(root) {
  const found = [];
  await walkFiles(root, async (absFile) => {
    const rel = path.relative(root, absFile).replace(/\\/g, "/");
    if (rel.startsWith(".git/")) return;
    if (isLearnerProgressPath(rel)) found.push(rel);
  });
  return found.sort();
}

async function ensureDevelopBranch(workDir, branch) {
  run("git", ["-C", workDir, "fetch", "origin", "--prune"]);

  const remoteHas = runOk("git", [
    "-C",
    workDir,
    "show-ref",
    "--verify",
    "--quiet",
    `refs/remotes/origin/${branch}`,
  ]);

  if (remoteHas.ok) {
    run("git", ["-C", workDir, "checkout", "-B", branch, `origin/${branch}`]);
    return { created: false };
  }

  const defaultRef =
    run("git", ["-C", workDir, "symbolic-ref", "refs/remotes/origin/HEAD"], {
      cwd: workDir,
    }).stdout.trim() || "refs/remotes/origin/main";
  const defaultBranch = defaultRef.replace(/^refs\/remotes\/origin\//, "") || "main";

  run("git", ["-C", workDir, "checkout", "-B", branch, `origin/${defaultBranch}`]);
  return { created: true, from: defaultBranch };
}

async function mirrorFiles(sourceRoot, destRoot, files) {
  const keep = new Set(files);
  const toDelete = new Set();

  // 1) Drop tracked dest files that we are not shipping (or that are progress/secrets).
  const destTracked = runOk("git", ["-C", destRoot, "ls-files", "-z"]);
  if (destTracked.ok && destTracked.stdout) {
    for (const rel of destTracked.stdout.split("\0").filter(Boolean)) {
      const posix = rel.replace(/\\/g, "/");
      if (keep.has(posix)) continue;
      if (shouldSyncPath(posix) || isLearnerProgressPath(posix) || isSecretEnvPath(posix)) {
        toDelete.add(posix);
      }
    }
  }

  // 2) Purge ANY score/delivery on the dest filesystem (tracked or leftover untracked).
  const destProgress = await findProgressFilesOnDisk(destRoot);
  for (const rel of destProgress) toDelete.add(rel);

  for (const rel of toDelete) {
    try {
      await fs.rm(path.join(destRoot, rel), { force: true });
    } catch {
      // ignore
    }
  }

  let copied = 0;
  let missing = 0;
  for (const rel of files) {
    const from = path.join(sourceRoot, rel);
    const to = path.join(destRoot, rel);
    try {
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.copyFile(from, to);
      copied += 1;
    } catch (err) {
      if (err && typeof err === "object" && err.code === "ENOENT") {
        missing += 1;
        continue;
      }
      throw err;
    }
  }

  return {
    copied,
    missing,
    deleted: toDelete.size,
    deletedPaths: [...toDelete].sort(),
    purgedProgress: destProgress,
  };
}

async function commitAndPush(workDir, branch, message, { dryRun, skipPush, createdBranch }) {
  // Make sure deleted progress files are staged for removal.
  run("git", ["-C", workDir, "add", "-A"]);
  const status = run("git", ["-C", workDir, "status", "--porcelain"], { cwd: workDir });
  const lines = status.stdout.trim() ? status.stdout.trim().split("\n") : [];
  if (lines.length === 0) {
    return { committed: false, pushed: false, reason: "no changes", changeCount: 0 };
  }

  if (dryRun) {
    return {
      committed: false,
      pushed: false,
      reason: "dry-run",
      status: lines.slice(0, 80),
      changeCount: lines.length,
    };
  }

  run("git", ["-C", workDir, "commit", "-m", message], { cwd: workDir });

  if (skipPush) {
    return { committed: true, pushed: false, reason: "skip-push", changeCount: lines.length };
  }

  const pushArgs = ["-C", workDir, "push", "origin", `HEAD:${branch}`];
  if (createdBranch) pushArgs.push("-u");
  run("git", pushArgs, { cwd: workDir });
  return { committed: true, pushed: true, changeCount: lines.length };
}

async function cloneFresh(repoUrl, workDir) {
  await fs.rm(workDir, { recursive: true, force: true });
  const gh = runOk("gh", ["repo", "clone", repoUrl, workDir]);
  if (gh.ok) return;
  run("git", ["clone", repoUrl, workDir]);
}

async function assertSourceHasLessonsAndGraph(root, files) {
  const hasGraphTxt = files.some((f) => f === "graph/courses/javascript.graph.txt");
  const hasGraphJson = files.some((f) => f === "graph/courses/javascript.graph.json");
  const lessonReadmes = files.filter(
    (f) => f.startsWith("course/") && /\/lessons\/[^/]+\//.test(f) && f.endsWith("/README.md"),
  );
  if (!hasGraphTxt || !hasGraphJson) {
    throw new Error("Refusing to sync: javascript graph files missing from source file list");
  }
  if (lessonReadmes.length < 1) {
    throw new Error("Refusing to sync: no course lesson README.md files found in source list");
  }
  process.stdout.write(
    `Integrity: ${lessonReadmes.length} lesson README(s), graph txt+json present\n`,
  );
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
  }

  const envPath = path.join(repoRoot, ".env");
  await loadEnvFile(envPath);

  const repoUrl = process.env.EDHARNESS_REPO_URL?.trim();
  const branch = (process.env.EDHARNESS_BRANCH || "develop").trim();

  if (!repoUrl) {
    process.stderr.write(
      `Missing EDHARNESS_REPO_URL.\nCreate ${path.relative(repoRoot, envPath)} (gitignored) — see .env.example\n`,
    );
    process.exit(2);
  }

  const ghAuth = runOk("gh", ["auth", "status"]);
  if (!ghAuth.ok) {
    process.stderr.write("GitHub CLI is not authenticated. Run: gh auth login\n");
    process.exit(2);
  }

  const files = await listSyncFiles(repoRoot);
  const progressExcluded = files.filter((f) => isLearnerProgressPath(f));
  if (progressExcluded.length) {
    throw new Error(
      `Internal error: progress paths leaked into sync list: ${progressExcluded.slice(0, 5).join(", ")}`,
    );
  }

  process.stdout.write(`Source files to sync: ${files.length}\n`);
  process.stdout.write(`Target: ${repoUrl} @ ${branch}\n`);
  await assertSourceHasLessonsAndGraph(repoRoot, files);

  const progressOnDisk = await findProgressFilesOnDisk(repoRoot);
  if (progressOnDisk.length) {
    process.stdout.write(
      `Excluded learner progress on source (${progressOnDisk.length}): ` +
        `${progressOnDisk.slice(0, 5).join(", ")}` +
        `${progressOnDisk.length > 5 ? ", …" : ""}\n`,
    );
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "ed-harness-sync-"));
  process.stdout.write(`Temp clone: ${workDir}\n`);

  try {
    await cloneFresh(repoUrl, workDir);
    const branchInfo = await ensureDevelopBranch(workDir, branch);
    if (branchInfo.created) {
      process.stdout.write(`Created local ${branch} from origin/${branchInfo.from}\n`);
    }

    const mirror = await mirrorFiles(repoRoot, workDir, files);
    process.stdout.write(
      `Copied: ${mirror.copied}, missing sources: ${mirror.missing}, deleted stale/progress: ${mirror.deleted}\n`,
    );
    if (mirror.purgedProgress.length) {
      process.stdout.write(
        `Purged from destination (${mirror.purgedProgress.length}): ` +
          `${mirror.purgedProgress.slice(0, 5).join(", ")}` +
          `${mirror.purgedProgress.length > 5 ? ", …" : ""}\n`,
      );
    }

    // Post-condition: destination must not contain progress files.
    const stillThere = await findProgressFilesOnDisk(workDir);
    if (stillThere.length) {
      throw new Error(
        `Refusing to commit: destination still has progress files: ${stillThere.slice(0, 10).join(", ")}`,
      );
    }

    // Post-condition: key lesson/graph files must exist on destination.
    for (const required of [
      "graph/courses/javascript.graph.txt",
      "graph/courses/javascript.graph.json",
      "course/javascript/modules/01-javascript-fundamentals/lessons/01.9.3-array-prototype-filter/README.md",
    ]) {
      try {
        await fs.access(path.join(workDir, required));
      } catch {
        throw new Error(`Refusing to commit: missing required file on destination: ${required}`);
      }
    }

    const message =
      args.message ||
      "chore: sync from PAULOs-NOTEBOOK (lessons+graph; purge score + project-delivery)";

    const result = await commitAndPush(workDir, branch, message, {
      dryRun: args.dryRun,
      skipPush: args.skipPush,
      createdBranch: branchInfo.created,
    });

    if (result.reason === "no changes") {
      process.stdout.write("No changes to commit — already in sync.\n");
    } else if (args.dryRun) {
      process.stdout.write(
        `Dry-run complete — would commit ${result.changeCount} path(s) (no commit/push).\n`,
      );
      if (result.status?.length) {
        process.stdout.write(
          `Would stage (first ${result.status.length}):\n${result.status.map((l) => `  ${l}`).join("\n")}\n`,
        );
      }
    } else {
      process.stdout.write(
        `Commit: ${result.committed ? "yes" : "no"}; push: ${result.pushed ? "yes" : "no"}${
          result.reason ? ` (${result.reason})` : ""
        }\n`,
      );
    }

    process.stdout.write("Done.\n");
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
    process.stdout.write(`Removed temp clone: ${workDir}\n`);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    process.stderr.write(`${String(err?.stack || err)}\n`);
    process.exit(1);
  });
}
