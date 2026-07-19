#!/usr/bin/env node
/**
 * Sync lesson content, graph, and frontend from this repo into a notebook repo.
 *
 * - Takes the notebook GitHub URL as a required CLI parameter
 * - Clones fresh into a temp directory
 * - Copies ONLY: course/, graph/, frontend/ (from git + disk walk)
 * - Does NOT copy learner progress from source: score.json, project-delivery.json, zips
 * - PRESERVES destination scores/deliveries — never deletes or overwrites them
 * - NEVER copies secrets (.env / .env.*) — only .env.example if present
 * - Does NOT touch other notebook paths outside course/, graph/, frontend/
 * - Commits and pushes to origin/develop (override with --branch)
 * - Auth: GitHub CLI (`gh`) already logged in on this machine
 *
 * Usage:
 *   node scripts/sync-to-notebook.mjs https://github.com/<owner>/<repo>
 *   node scripts/sync-to-notebook.mjs https://github.com/<owner>/<repo> --dry-run
 *   node scripts/sync-to-notebook.mjs https://github.com/<owner>/<repo> --skip-push
 *   node scripts/sync-to-notebook.mjs https://github.com/<owner>/<repo> --branch develop -m "msg"
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

/** Only these trees are mirrored into the notebook. */
export const SYNC_ROOTS = ["course", "graph", "frontend"];

function parseArgs(argv) {
  const args = {
    repoUrl: null,
    dryRun: false,
    skipPush: false,
    message: null,
    branch: "develop",
    help: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--skip-push") args.skipPush = true;
    else if (arg === "--message" || arg === "-m") args.message = argv[++i];
    else if (arg === "--branch" || arg === "-b") args.branch = argv[++i];
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (!arg.startsWith("-") && !args.repoUrl) args.repoUrl = arg;
    else {
      const err = new Error(`Unknown argument: ${arg}`);
      err.code = "USAGE";
      throw err;
    }
  }
  return args;
}

function usage() {
  return [
    "Usage: node scripts/sync-to-notebook.mjs <notebook-repo-url> [options]",
    "",
    "Mirrors course/, graph/, and frontend/ from this repo into the notebook.",
    "",
    "Options:",
    "  --dry-run          Copy into a temp clone and report status; no commit/push",
    "  --skip-push        Commit locally in the temp clone but do not push",
    "  --branch, -b NAME  Target branch (default: develop)",
    "  --message, -m MSG  Commit message",
    "  --help, -h         Show this help",
    "",
    "Example:",
    "  node scripts/sync-to-notebook.mjs https://github.com/paulocymbaum/paulo-notebook",
    "",
    "Pushes with the GitHub CLI. Run `gh auth status` first if unsure.",
  ].join("\n");
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
  ]);
  if (parts.some((p) => blockedDirs.has(p))) return true;
  if (parts.includes(".ed-harness-runtime")) return true;
  return false;
}

export function isUnderSyncRoot(relPosix) {
  const normalized = relPosix.replace(/\\/g, "/").replace(/^\.\//, "");
  return SYNC_ROOTS.some(
    (root) => normalized === root || normalized.startsWith(`${root}/`),
  );
}

export function shouldSyncPath(relPosix) {
  const normalized = relPosix.replace(/\\/g, "/").replace(/^\.\//, "");
  if (!normalized || normalized === ".") return false;
  if (!isUnderSyncRoot(normalized)) return false;
  if (isSecretEnvPath(normalized)) return false;
  if (isLearnerProgressPath(normalized)) return false;
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

/** Collect every file under the sync roots from disk. */
export async function listForcedDiskFiles(root) {
  const out = [];
  for (const relRoot of SYNC_ROOTS) {
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

/** Find learner-progress files under sync roots (for exclude logs + dest purge). */
export async function findProgressFilesOnDisk(root, { syncRootsOnly = true } = {}) {
  const found = [];
  const roots = syncRootsOnly ? SYNC_ROOTS : ["."];
  for (const relRoot of roots) {
    const absRoot = path.join(root, relRoot === "." ? "" : relRoot);
    await walkFiles(absRoot, async (absFile) => {
      const rel = path.relative(root, absFile).replace(/\\/g, "/");
      if (rel.startsWith(".git/")) return;
      if (isLearnerProgressPath(rel)) found.push(rel);
    });
  }
  return found.sort();
}

async function ensureBranch(workDir, branch) {
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

/**
 * Partial mirror: only add/update/delete under SYNC_ROOTS.
 * Leaves every other notebook path alone.
 * Never deletes destination learner progress or secrets.
 */
async function mirrorFiles(sourceRoot, destRoot, files) {
  const keep = new Set(files);
  const toDelete = new Set();

  const destTracked = runOk("git", ["-C", destRoot, "ls-files", "-z"]);
  if (destTracked.ok && destTracked.stdout) {
    for (const rel of destTracked.stdout.split("\0").filter(Boolean)) {
      const posix = rel.replace(/\\/g, "/");
      if (!isUnderSyncRoot(posix)) continue;
      if (keep.has(posix)) continue;
      // Preserve notebook scores/deliveries and env secrets.
      if (isLearnerProgressPath(posix) || isSecretEnvPath(posix)) continue;
      if (shouldSyncPath(posix)) toDelete.add(posix);
    }
  }

  const preservedProgress = await findProgressFilesOnDisk(destRoot, { syncRootsOnly: true });

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
    preservedProgress,
  };
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

export function assertSourceHasLessonsAndGraph(files) {
  const hasGraphTxt = files.some((f) => f === "graph/courses/javascript.graph.txt");
  const hasGraphJson = files.some((f) => f === "graph/courses/javascript.graph.json");
  const lessonReadmes = files.filter(
    (f) => f.startsWith("course/") && /\/lessons\/[^/]+\//.test(f) && f.endsWith("/README.md"),
  );
  const frontendFiles = files.filter((f) => f.startsWith("frontend/"));

  if (!hasGraphTxt || !hasGraphJson) {
    throw new Error("Refusing to sync: javascript graph files missing from source file list");
  }
  if (lessonReadmes.length < 1) {
    throw new Error("Refusing to sync: no course lesson README.md files found in source list");
  }
  if (frontendFiles.length < 1) {
    throw new Error("Refusing to sync: no frontend/ files found in source list");
  }

  return {
    lessonReadmes: lessonReadmes.length,
    frontendFiles: frontendFiles.length,
  };
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    if (err && err.code === "USAGE") {
      process.stderr.write(`${err.message}\n\n${usage()}\n`);
      process.exit(2);
    }
    throw err;
  }

  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    process.exit(0);
  }

  const repoUrl = args.repoUrl?.trim();
  const branch = (args.branch || "develop").trim();

  if (!repoUrl) {
    process.stderr.write(`Missing notebook repo URL.\n\n${usage()}\n`);
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
  process.stdout.write(`Roots: ${SYNC_ROOTS.join(", ")}\n`);
  process.stdout.write(`Target: ${repoUrl} @ ${branch}\n`);

  const integrity = assertSourceHasLessonsAndGraph(files);
  process.stdout.write(
    `Integrity: ${integrity.lessonReadmes} lesson README(s), ${integrity.frontendFiles} frontend file(s), graph txt+json present\n`,
  );

  const progressOnDisk = await findProgressFilesOnDisk(repoRoot, { syncRootsOnly: true });
  if (progressOnDisk.length) {
    process.stdout.write(
      `Not copying source learner progress (${progressOnDisk.length}): ` +
        `${progressOnDisk.slice(0, 5).join(", ")}` +
        `${progressOnDisk.length > 5 ? ", …" : ""}\n`,
    );
  }

  const workDir = await fs.mkdtemp(path.join(os.tmpdir(), "notebook-sync-"));
  process.stdout.write(`Temp clone: ${workDir}\n`);

  try {
    await cloneFresh(repoUrl, workDir);
    const branchInfo = await ensureBranch(workDir, branch);
    if (branchInfo.created) {
      process.stdout.write(`Created local ${branch} from origin/${branchInfo.from}\n`);
    }

    const mirror = await mirrorFiles(repoRoot, workDir, files);
    process.stdout.write(
      `Copied: ${mirror.copied}, missing sources: ${mirror.missing}, deleted stale (non-progress): ${mirror.deleted}\n`,
    );
    if (mirror.preservedProgress.length) {
      process.stdout.write(
        `Preserved destination scores/deliveries (${mirror.preservedProgress.length}): ` +
          `${mirror.preservedProgress.slice(0, 5).join(", ")}` +
          `${mirror.preservedProgress.length > 5 ? ", …" : ""}\n`,
      );
    }

    for (const required of [
      "graph/courses/javascript.graph.txt",
      "graph/courses/javascript.graph.json",
      "frontend/package.json",
    ]) {
      try {
        await fs.access(path.join(workDir, required));
      } catch {
        throw new Error(`Refusing to commit: missing required file on destination: ${required}`);
      }
    }

    const message =
      args.message ||
      "chore: sync course + graph + frontend from ed-harness";

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
