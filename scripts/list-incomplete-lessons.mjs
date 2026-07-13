#!/usr/bin/env node
/**
 * List incomplete study lessons in a module.
 *
 * Checks structure, authored README (not scaffold-only), quiz, and PBL project.
 *
 * Usage:
 *   node scripts/list-incomplete-lessons.mjs --module 04-advanced-javascript
 *   node scripts/list-incomplete-lessons.mjs --course javascript --module 04-advanced-javascript
 *   node scripts/list-incomplete-lessons.mjs --module 04-advanced-javascript --json
 *   node scripts/list-incomplete-lessons.mjs --module 04-advanced-javascript --all-status
 *
 * Exit codes:
 *   0 — every study lesson is complete (or module has no study lessons)
 *   1 — at least one incomplete lesson
 *   2 — usage / path error
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { REQUIRED_PBL_SECTIONS } from "../.cursor/skills/create-course-project/scripts/project-contract.mjs";

const require = createRequire(import.meta.url);
const { loadGraph, findNodeByIndex, isLeafNode, courseSlugFromPath } = require("./graph/graph-index.js");

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const courseDir = path.join(repoRoot, "course");

const LESSON_SCAFFOLD_HEADINGS = [
  "Context",
  "Predict first",
  "Explanation",
  "What to observe",
  "Quick challenge",
];

const MIN_README_SUBSTANTIVE_CHARS = 120;
const MIN_QUIZ_QUESTIONS = 1;
const MIN_SCORED_TEST_CASES = 1;

async function listDirSafe(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function readTextSafe(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

async function readJsonSafe(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function parseArgs(argv) {
  const args = {
    course: null,
    module: null,
    json: false,
    allStatus: false,
    includeMock: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--course") args.course = argv[++i];
    else if (arg === "--module") args.module = argv[++i];
    else if (arg === "--json") args.json = true;
    else if (arg === "--all-status") args.allStatus = true;
    else if (arg === "--include-mock") args.includeMock = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
  }
  return args;
}

function usage() {
  return [
    "Usage:",
    "  node scripts/list-incomplete-lessons.mjs --module <moduleId> [--course <slug>]",
    "  node scripts/list-incomplete-lessons.mjs --module <moduleId> --json",
    "  node scripts/list-incomplete-lessons.mjs --module <moduleId> --all-status",
    "",
    "Options:",
    "  --course <slug>     Course folder under course/ (inferred from module path if omitted)",
    "  --module <id>       Module id, e.g. 04-advanced-javascript",
    "  --json              Machine-readable output",
    "  --all-status        Print complete lessons too",
    "  --include-mock      Also scan *-mock modules (default: study modules only)",
  ].join("\n");
}

function stripMarkdownNoise(text) {
  return String(text ?? "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^>\s.*$/gm, " ")
    .replace(/^#{1,6}\s+.*$/gm, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitMarkdownSections(markdown) {
  const lines = String(markdown ?? "").replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = { heading: null, bodyLines: [] };

  for (const line of lines) {
    const match = /^(#{2})\s+(.+?)\s*$/.exec(line);
    if (match) {
      sections.push(current);
      current = { heading: match[2].replace(/\s+/g, " ").trim(), bodyLines: [] };
      continue;
    }
    current.bodyLines.push(line);
  }
  sections.push(current);
  return sections;
}

function sectionBodyText(section) {
  return stripMarkdownNoise(section.bodyLines.join("\n"));
}

function isPlaceholderOnly(text) {
  const t = String(text ?? "").trim();
  if (!t) return true;
  if (/^(- \[[ xX]?\]\s*)+$/i.test(t)) return true;
  if (/^(1\.\s*)+$/i.test(t)) return true;
  if (/^(TODO|TBD|Not implemented yet\.?)$/i.test(t)) return true;
  return false;
}

function analyzeLessonReadme(readme) {
  const issues = [];
  if (!readme.trim()) {
    return { ok: false, scaffoldOnly: true, issues: ["README.md missing or empty"], substantiveChars: 0 };
  }

  const substantive = stripMarkdownNoise(readme);
  const sections = splitMarkdownSections(readme);
  const byHeading = new Map(
    sections.filter((s) => s.heading).map((s) => [s.heading.toLowerCase(), s]),
  );

  const scaffoldBodies = LESSON_SCAFFOLD_HEADINGS.map((heading) => {
    const section = byHeading.get(heading.toLowerCase());
    const body = section ? sectionBodyText(section) : "";
    return { heading, empty: !section || isPlaceholderOnly(body), body };
  });

  const namedScaffoldCount = scaffoldBodies.filter((s) =>
    byHeading.has(s.heading.toLowerCase()),
  ).length;
  const emptyScaffoldCount = scaffoldBodies.filter((s) => s.empty).length;
  const scaffoldOnly =
    namedScaffoldCount >= 3 &&
    emptyScaffoldCount >= Math.min(3, namedScaffoldCount) &&
    substantive.length < MIN_README_SUBSTANTIVE_CHARS;

  if (scaffoldOnly) {
    issues.push(
      "README looks scaffold-only (Context / Predict first / Explanation / What to observe still empty)",
    );
  } else if (substantive.length < MIN_README_SUBSTANTIVE_CHARS) {
    issues.push(
      `README content too thin (${substantive.length} substantive chars; need ≥ ${MIN_README_SUBSTANTIVE_CHARS})`,
    );
  }

  const hasPredict =
    byHeading.has("predict first") ||
    byHeading.has("what to observe") ||
    byHeading.has("quick challenge") ||
    byHeading.has("mini-exercise");
  if (!hasPredict && !scaffoldOnly) {
    issues.push("README missing predict-first style sections (Predict first / What to observe / Mini-exercise)");
  }

  return {
    ok: issues.length === 0,
    scaffoldOnly,
    issues,
    substantiveChars: substantive.length,
  };
}

function analyzeProjectReadme(readme) {
  const issues = [];
  if (!readme.trim()) {
    return { ok: false, issues: ["project README.md missing or empty"] };
  }

  const sections = splitMarkdownSections(readme);
  const byHeading = new Map();
  for (const section of sections.filter((s) => s.heading)) {
    const key = section.heading.toLowerCase().replace(/\s*\(.*?\)\s*$/, "").trim();
    byHeading.set(key, section);
  }

  for (const required of REQUIRED_PBL_SECTIONS) {
    const key = required.toLowerCase();
    const section = byHeading.get(key);
    if (!section) {
      issues.push(`project README missing section "## ${required}"`);
      continue;
    }
    const body = sectionBodyText(section);
    if (isPlaceholderOnly(body)) {
      issues.push(`project README section "## ${required}" is empty/placeholder`);
    }
  }

  return { ok: issues.length === 0, issues };
}

function analyzeTestsJson(tests) {
  const issues = [];
  if (!tests || typeof tests !== "object" || !Array.isArray(tests.cases)) {
    return { ok: false, issues: ["starter/tests.json missing or invalid"], scored: 0 };
  }
  if (tests.cases.length === 0) {
    return { ok: false, issues: ["starter/tests.json has no cases"], scored: 0 };
  }

  const scored = tests.cases.filter(
    (c) =>
      (typeof c.expectedStdout === "string" && c.expectedStdout.length > 0) ||
      typeof c.expectedExitCode === "number",
  );

  const allStub =
    tests.cases.length > 0 &&
    tests.cases.every(
      (c) =>
        (c.stdin == null || String(c.stdin) === "") &&
        (c.expectedStdout == null || String(c.expectedStdout) === ""),
    );

  if (allStub) {
    issues.push("starter/tests.json still looks like the empty scaffold stub");
  }
  if (scored.length < MIN_SCORED_TEST_CASES) {
    issues.push(
      `starter/tests.json needs ≥ ${MIN_SCORED_TEST_CASES} scored case(s) with expectedStdout/expectedExitCode`,
    );
  }

  return { ok: issues.length === 0, issues, scored: scored.length };
}

function runQuizValidator(quizPath) {
  const validateScript = path.join(
    repoRoot,
    ".cursor/skills/create-course-quiz/scripts/validate-quiz.mjs",
  );
  try {
    execFileSync("node", [validateScript, quizPath], {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8",
    });
    return [];
  } catch (err) {
    const output = `${err.stdout || ""}${err.stderr || err.message || ""}`.trim();
    return [output || "quiz failed schema validation"];
  }
}

function runProjectValidator(projectsRoot) {
  const validateScript = path.join(
    repoRoot,
    ".cursor/skills/create-course-project/scripts/validate-project.mjs",
  );
  try {
    execFileSync("node", [validateScript, path.relative(repoRoot, projectsRoot)], {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8",
    });
    return [];
  } catch (err) {
    const output = `${err.stdout || ""}${err.stderr || ""}`;
    const lines = output
      .split("\n")
      .filter((l) => l.startsWith("ERROR"))
      .map((l) => l.replace(/^ERROR\s+/, ""));
    return lines.length > 0 ? lines : [output.trim() || "project validation failed"];
  }
}

async function resolveModulePath(courseSlug, moduleId) {
  if (!moduleId) return null;

  if (courseSlug) {
    const candidate = path.join(courseDir, courseSlug, "modules", moduleId);
    if (await pathExists(candidate)) return candidate;
    return null;
  }

  const courses = (await listDirSafe(courseDir)).filter((e) => e.isDirectory());
  const matches = [];
  for (const course of courses) {
    const candidate = path.join(courseDir, course.name, "modules", moduleId);
    if (await pathExists(candidate)) matches.push(candidate);
  }
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new Error(
      `Module "${moduleId}" found in multiple courses. Pass --course (${matches
        .map((m) => path.relative(courseDir, m).split(path.sep)[0])
        .join(", ")})`,
    );
  }
  return null;
}

async function inspectQuiz(lessonPath, lessonId, graphIndex) {
  const issues = [];
  const quizPath = path.join(lessonPath, "quiz", "quiz.json");
  if (!(await pathExists(quizPath))) {
    return { ok: false, issues: ["quiz/quiz.json missing"] };
  }

  const quiz = await readJsonSafe(quizPath);
  if (!quiz) {
    return { ok: false, issues: ["quiz/quiz.json is not valid JSON"] };
  }

  issues.push(...runQuizValidator(quizPath).map((m) => `quiz validation: ${m}`));

  if (!Array.isArray(quiz.questions) || quiz.questions.length < MIN_QUIZ_QUESTIONS) {
    issues.push(`quiz needs ≥ ${MIN_QUIZ_QUESTIONS} question(s)`);
  }
  if (quiz.lessonId && lessonId && quiz.lessonId !== lessonId) {
    issues.push(`quiz.lessonId "${quiz.lessonId}" does not match lesson id "${lessonId}"`);
  }
  if (quiz.graphIndex && graphIndex && quiz.graphIndex !== graphIndex) {
    issues.push(`quiz.graphIndex "${quiz.graphIndex}" does not match "${graphIndex}"`);
  }

  const thinPrompts = (quiz.questions || []).filter(
    (q) => !q?.prompt || String(q.prompt).trim().length < 8,
  ).length;
  if (thinPrompts > 0) {
    issues.push(`quiz has ${thinPrompts} question(s) with empty/too-short prompts`);
  }

  return { ok: issues.length === 0, issues, questionCount: quiz.questions?.length ?? 0 };
}

async function inspectProjects(lessonPath) {
  const issues = [];
  const projectsRoot = path.join(lessonPath, "projects");
  if (!(await pathExists(projectsRoot))) {
    return { ok: false, issues: ["projects/ directory missing"] };
  }

  const entries = await listDirSafe(projectsRoot);
  const projectDirs = entries
    .filter((e) => e.isDirectory() && /^\d{3}-/.test(e.name))
    .map((e) => e.name)
    .sort();

  if (projectDirs.length === 0) {
    return { ok: false, issues: ["no NNN-* project folder under projects/"] };
  }

  issues.push(...runProjectValidator(projectsRoot).map((m) => `project validation: ${m}`));

  // Deep-check first project (canonical lesson has one); flag stubs across all.
  for (const dirName of projectDirs) {
    const projectPath = path.join(projectsRoot, dirName);
    const readme = await readTextSafe(path.join(projectPath, "README.md"));
    const readmeAnalysis = analyzeProjectReadme(readme);
    issues.push(...readmeAnalysis.issues.map((m) => `${dirName}: ${m}`));

    const starterPath = path.join(projectPath, "starter", "index.js");
    const testsPath = path.join(projectPath, "starter", "tests.json");
    const samplePath = path.join(projectPath, "starter", "sample.input");

    if (!(await pathExists(starterPath))) issues.push(`${dirName}: starter/index.js missing`);
    if (!(await pathExists(testsPath))) issues.push(`${dirName}: starter/tests.json missing`);
    if (!(await pathExists(samplePath))) {
      issues.push(`${dirName}: starter/sample.input missing`);
    } else {
      const sample = await readTextSafe(samplePath);
      const usable = sample
        .split("\n")
        .filter((line) => !line.trim().startsWith("#"))
        .join("\n")
        .trim();
      if (!usable) issues.push(`${dirName}: starter/sample.input is empty/comment-only`);
    }

    const tests = await readJsonSafe(testsPath);
    const testsAnalysis = analyzeTestsJson(tests);
    issues.push(...testsAnalysis.issues.map((m) => `${dirName}: ${m}`));
  }

  return { ok: issues.length === 0, issues, projectCount: projectDirs.length, projects: projectDirs };
}

async function inspectLesson(lessonPath, graph) {
  const lessonId = path.basename(lessonPath);
  const rel = path.relative(repoRoot, lessonPath);
  const issues = [];
  const checks = {
    structure: { ok: true, issues: [] },
    readme: { ok: true, issues: [] },
    quiz: { ok: true, issues: [] },
    project: { ok: true, issues: [] },
  };

  const meta = await readJsonSafe(path.join(lessonPath, "lesson.meta.json"));
  if (!meta || typeof meta !== "object") {
    checks.structure.ok = false;
    checks.structure.issues.push("lesson.meta.json missing or invalid");
  } else {
    if (!meta.id || !meta.graphIndex || !meta.title) {
      checks.structure.ok = false;
      checks.structure.issues.push("lesson.meta.json missing id/graphIndex/title");
    }
    if (meta.mockTestSection) {
      return {
        lessonId,
        path: rel,
        kind: "mock-section",
        complete: false,
        skipped: true,
        issues: [
          "mock-test section lesson — skipped (use create-mock-test checklist; pass a study module id)",
        ],
        checks,
      };
    }
    if (!meta.graphNodeId) {
      checks.structure.ok = false;
      checks.structure.issues.push("lesson.meta.json missing graphNodeId");
    }
    if (graph && meta.graphIndex) {
      const node = findNodeByIndex(graph, meta.graphIndex);
      if (!node) {
        checks.structure.ok = false;
        checks.structure.issues.push(`graphIndex "${meta.graphIndex}" not found in graph`);
      } else if (!isLeafNode(graph, node.id)) {
        checks.structure.ok = false;
        checks.structure.issues.push(`graphIndex "${meta.graphIndex}" is not a leaf node`);
      }
    }
  }

  if (!(await pathExists(path.join(lessonPath, ".cursor-created.json")))) {
    checks.structure.ok = false;
    checks.structure.issues.push(".cursor-created.json missing");
  }

  const readme = await readTextSafe(path.join(lessonPath, "README.md"));
  checks.readme = analyzeLessonReadme(readme);

  checks.quiz = await inspectQuiz(lessonPath, meta?.id || lessonId, meta?.graphIndex);
  checks.project = await inspectProjects(lessonPath);

  for (const key of Object.keys(checks)) {
    issues.push(...checks[key].issues);
  }

  return {
    lessonId,
    path: rel,
    graphIndex: meta?.graphIndex ?? null,
    kind: "study",
    complete: issues.length === 0,
    skipped: false,
    issues,
    checks,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.module) {
    process.stderr.write(`${usage()}\n`);
    process.exit(args.help ? 0 : 2);
  }

  if (args.module.endsWith("-mock") && !args.includeMock) {
    process.stderr.write(
      `Module "${args.module}" is a mock test. Pass a study module id, or use --include-mock (limited).\n`,
    );
    process.exit(2);
  }

  let modulePath;
  try {
    modulePath = await resolveModulePath(args.course, args.module);
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(2);
  }

  if (!modulePath) {
    process.stderr.write(
      `Module not found: ${args.course ? `${args.course}/modules/${args.module}` : args.module}\n`,
    );
    process.exit(2);
  }

  const courseSlug = args.course || courseSlugFromPath(modulePath, repoRoot);
  const graph = loadGraph({ repoRoot, courseSlug });
  const lessonsRoot = path.join(modulePath, "lessons");
  const lessonDirs = (await listDirSafe(lessonsRoot))
    .filter((e) => e.isDirectory())
    .map((e) => path.join(lessonsRoot, e.name))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b), "en"));

  const reports = [];
  for (const lessonPath of lessonDirs) {
    reports.push(await inspectLesson(lessonPath, graph));
  }

  const studyReports = reports.filter((r) => !r.skipped);
  const incomplete = studyReports.filter((r) => !r.complete);
  const complete = studyReports.filter((r) => r.complete);

  if (args.json) {
    process.stdout.write(
      `${JSON.stringify(
        {
          course: courseSlug,
          module: args.module,
          modulePath: path.relative(repoRoot, modulePath),
          totals: {
            lessons: studyReports.length,
            complete: complete.length,
            incomplete: incomplete.length,
          },
          incomplete,
          ...(args.allStatus ? { complete } : {}),
        },
        null,
        2,
      )}\n`,
    );
  } else {
    process.stdout.write(
      `Module ${args.module} (${courseSlug}): ${complete.length}/${studyReports.length} complete\n\n`,
    );

    const toPrint = args.allStatus ? studyReports : incomplete;
    if (toPrint.length === 0) {
      process.stdout.write("No incomplete lessons.\n");
    }

    for (const report of toPrint) {
      const label = report.complete ? "COMPLETE" : "INCOMPLETE";
      process.stdout.write(`${label}  ${report.lessonId}\n`);
      if (!report.complete) {
        for (const issue of report.issues) {
          process.stdout.write(`  - ${issue}\n`);
        }
      }
      process.stdout.write("\n");
    }

    process.stdout.write(
      `Summary: ${incomplete.length} incomplete, ${complete.length} complete\n`,
    );
  }

  process.exit(incomplete.length > 0 ? 1 : 0);
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err}\n`);
  process.exit(2);
});
