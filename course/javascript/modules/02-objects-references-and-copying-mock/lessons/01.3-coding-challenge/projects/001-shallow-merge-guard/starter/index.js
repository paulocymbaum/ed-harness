/**
 * Shallow Merge Guard
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function shallowMergeGuard(a, b) {
  // TODO: return a new object = shallow copy of a with b's own enumerable keys merged on top
  // must not mutate a
  throw new Error("Not implemented");
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 2) return;

    // TODO: parse both lines as JSON (catch invalid json), call shallowMergeGuard, print JSON.stringify(result)
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
