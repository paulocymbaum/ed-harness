const path = require("path");
const {
  loadGraph,
  normalize,
  extractIndexPath,
  stripIndexPrefix,
  normalizeLabelText,
  normalizeIndexPath,
  indexPathsEqual,
  labelsMatch,
  resolveGraphPaths,
} = require("../../../scripts/graph/graph-index.js");

function parseCourseArg(argv = process.argv) {
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--course") return argv[i + 1] ?? null;
  }
  return process.env.COURSE_SLUG || null;
}

function positionalArgs(argv = process.argv) {
  const out = [];
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--course") {
      i += 1;
      continue;
    }
    if (String(argv[i]).startsWith("-")) continue;
    out.push(argv[i]);
  }
  return out;
}

function loadCourseGraph(options = {}) {
  const repoRoot = options.repoRoot ?? path.resolve(__dirname, "../../..");
  const courseSlug = options.courseSlug ?? parseCourseArg(options.argv ?? process.argv);

  if (!courseSlug) {
    const err = new Error(
      "Missing course: pass --course <slug> or set COURSE_SLUG (e.g. --course javascript)",
    );
    err.code = "MISSING_COURSE";
    throw err;
  }

  const paths = resolveGraphPaths({ repoRoot, courseSlug });
  const graph = loadGraph({ repoRoot, courseSlug });
  return { graph, courseSlug, paths };
}

module.exports = {
  loadGraph,
  loadCourseGraph,
  parseCourseArg,
  positionalArgs,
  normalize,
  extractIndexPath,
  stripIndexPrefix,
  normalizeLabelText,
  normalizeIndexPath,
  indexPathsEqual,
  labelsMatch,
};
