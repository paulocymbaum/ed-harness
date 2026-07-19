#!/usr/bin/env node
/**
 * Sync this repo into paulocymbaum/ed-harness (or EDHARNESS_REPO_URL) on develop.
 *
 * - Clones fresh into a temp directory
 * - Copies tracked (+ untracked non-ignored) files
 * - NEVER copies learner progress: score.json, project-delivery.json, course-scores zips
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
  // Score/delivery extract archives (and the local `backup.zip` progress dump).
  if (/^course-scores-.*\.zip$/i.test(base)) return true;
  if (base === "backup.zip") return true;
  if (relPosix === ".ed-harness-runtime" || relPosix.startsWith(".ed-harness-runtime/")) {
    return true;
  }
  return false;
}

/** Machine-local launch/workspace paths that should not land on ed-harness. */
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

/** Build/runtime noise that must not ship even if present on disk. */
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

export function listSyncFiles(root) {
  const tracked = run("git", ["-C", root, "ls-files", "-z"], { cwd: root });
  const others = run(
    "git",
    ["-C", root, "ls-files", "-z", "--others", "--exclude-standard"],
    { cwd: root },
  );
  const all = `${tracked.stdout || ""}${others.stdout || ""}`
    .split("\0")
    .map((p) => p.trim())
    .filter(Boolean);
  const unique = [...new Set(all.map((p) => p.replace(/\\/g, "/")))];
  return unique.filter(shouldSyncPath).sort();
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
  const destTracked = runOk("git", ["-C", destRoot, "ls-files", "-z"]);
  const toDelete = [];
  if (destTracked.ok && destTracked.stdout) {
    for (const rel of destTracked.stdout.split("\0").filter(Boolean)) {
      const posix = rel.replace(/\\/g, "/");
      if (keep.has(posix)) continue;
      if (shouldSyncPath(posix) || isLearnerProgressPath(posix) || isSecretEnvPath(posix)) {
        toDelete.push(posix);
      }
    }
  }
  const uniqueDelete = [...new Set(toDelete)];

  for (const rel of uniqueDelete) {
    try {
      await fs.rm(path.join(destRoot, rel), { force: true });
    } catch {
      // ignore
    }
  }

  for (const rel of files) {
    const from = path.join(sourceRoot, rel);
    const to = path.join(destRoot, rel);
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  }

  return { copied: files.length, deleted: uniqueDelete.length, deletedPaths: uniqueDelete };
}

async function commitAndPush(workDir, branch, message, { dryRun, skipPush, createdBranch }) {
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
      status: lines.slice(0, 60),
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
  // gh/git clone need the destination to not exist yet.
  await fs.rm(workDir, { recursive: true, force: true });
  const gh = runOk("gh", ["repo", "clone", repoUrl, workDir]);
  if (gh.ok) return;
  run("git", ["clone", repoUrl, workDir]);
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

  const files = listSyncFiles(repoRoot);
  process.stdout.write(`Source files to sync: ${files.length}\n`);
  process.stdout.write(`Target: ${repoUrl} @ ${branch}\n`);

  const progressWouldHaveSynced = listWouldBeProgressFiles(repoRoot);
  if (progressWouldHaveSynced.length) {
    process.stdout.write(
      `Excluded learner progress (${progressWouldHaveSynced.length}): ` +
        `${progressWouldHaveSynced.slice(0, 5).join(", ")}` +
        `${progressWouldHaveSynced.length > 5 ? ", …" : ""}\n`,
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

    // Mirror into the temp clone so dry-run can report a real git status.
    const mirror = await mirrorFiles(repoRoot, workDir, files);
    process.stdout.write(`Copied: ${mirror.copied}, deleted stale: ${mirror.deleted}\n`);

    const message =
      args.message ||
      "chore: sync from PAULOs-NOTEBOOK (exclude score + project-delivery)";

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
    // Always remove the temp clone — success, dry-run, or failure.
    await fs.rm(workDir, { recursive: true, force: true });
    process.stdout.write(`Removed temp clone: ${workDir}\n`);
  }
}

/** List progress files that exist on disk (for logging exclusions). */
function listWouldBeProgressFiles(root) {
  const tracked = run("git", ["-C", root, "ls-files", "-z"], { cwd: root });
  const others = run(
    "git",
    ["-C", root, "ls-files", "-z", "--others", "--exclude-standard"],
    { cwd: root },
  );
  return `${tracked.stdout || ""}${others.stdout || ""}`
    .split("\0")
    .map((p) => p.replace(/\\/g, "/").trim())
    .filter((p) => p && isLearnerProgressPath(p))
    .sort();
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    process.stderr.write(`${String(err?.stack || err)}\n`);
    process.exit(1);
  });
}
