const { bfs } = require("../../../scripts/graph/utils/bfs");
const { dfs } = require("../../../scripts/graph/utils/dfs");
const { loadCourseGraph, labelsMatch, parseCourseArg, positionalArgs } = require("./_loadGraph");

function usage() {
  return [
    "Usage: node .cursor/tools/graph/bfs-then-dfs-list-subtree.js --course <slug> <sectionLabel>",
    'Example: node .cursor/tools/graph/bfs-then-dfs-list-subtree.js --course javascript "Asynchronous JavaScript"',
  ].join("\n");
}

function main() {
  const [sectionRaw] = positionalArgs();
  if (!sectionRaw || !parseCourseArg()) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const { graph, courseSlug } = loadCourseGraph();

  let sectionNode = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (!sectionNode && labelsMatch(node.label, sectionRaw)) sectionNode = node;
    },
  });

  if (!sectionNode) {
    process.stdout.write(`SECTION_NOT_FOUND: ${sectionRaw} (course=${courseSlug})\n`);
    process.exitCode = 1;
    return;
  }

  const labels = [];
  dfs(graph, sectionNode.id, {
    visit: (node) => labels.push(node.label),
  });

  process.stdout.write(
    JSON.stringify({ courseSlug, section: sectionNode, subtreeLabels: labels }, null, 2) + "\n",
  );
}

if (require.main === module) main();
