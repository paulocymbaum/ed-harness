const { dfs } = require("../../../scripts/graph/utils/dfs");
const { bfs } = require("../../../scripts/graph/utils/bfs");
const { loadCourseGraph, labelsMatch, parseCourseArg, positionalArgs } = require("./_loadGraph");

function buildParents(graph) {
  const parents = new Map();
  for (const e of graph.edges || []) parents.set(e.to, e.from);
  return parents;
}

function usage() {
  return [
    "Usage: node .cursor/tools/graph/dfs-then-bfs-nearby.js --course <slug> <targetLabel> [radiusDepth=1]",
    'Example: node .cursor/tools/graph/dfs-then-bfs-nearby.js --course javascript "Promises" 1',
  ].join("\n");
}

function main() {
  const [targetRaw, radiusRaw] = positionalArgs();
  const radiusDepth = Number(radiusRaw ?? "1");

  if (!targetRaw || !parseCourseArg()) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const { graph, courseSlug } = loadCourseGraph();
  const parents = buildParents(graph);

  let found = null;
  dfs(graph, graph.rootId, {
    visit: (node) => {
      if (!found && labelsMatch(node.label, targetRaw)) found = node;
    },
  });

  if (!found) {
    process.stdout.write(`NOT_FOUND: ${targetRaw} (course=${courseSlug})\n`);
    process.exitCode = 1;
    return;
  }

  const anchorId = parents.get(found.id) || found.id;
  const nearby = [];

  bfs(graph, anchorId, {
    maxDepth: Number.isFinite(radiusDepth) ? radiusDepth : 1,
    visit: (node) => nearby.push(node),
  });

  process.stdout.write(
    JSON.stringify(
      {
        courseSlug,
        target: found,
        anchorId,
        radiusDepth,
        nearby: nearby.map((n) => ({ id: n.id, label: n.label })),
      },
      null,
      2,
    ) + "\n",
  );
}

if (require.main === module) main();
