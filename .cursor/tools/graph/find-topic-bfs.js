const { bfs } = require("../../../scripts/graph/utils/bfs");
const { loadCourseGraph, labelsMatch, parseCourseArg, positionalArgs } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/find-topic-bfs.js --course <slug> <label>",
    'Example: node .cursor/tools/graph/find-topic-bfs.js --course javascript "Closures"',
  ].join("\n");
}

function main() {
  const [targetRaw] = positionalArgs();
  if (!targetRaw || !parseCourseArg()) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const { graph, courseSlug } = loadCourseGraph();

  let found = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (!found && labelsMatch(node.label, targetRaw)) found = node;
    },
  });

  if (!found) {
    process.stdout.write(`NOT_FOUND: ${targetRaw} (course=${courseSlug})\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(JSON.stringify({ courseSlug, node: found }, null, 2) + "\n");
}

if (require.main === module) main();
