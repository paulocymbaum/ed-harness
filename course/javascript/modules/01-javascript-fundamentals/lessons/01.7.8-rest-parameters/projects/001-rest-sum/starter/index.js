/**
 * Rest Sum
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function sum(/* TODO: ...nums */) {
  // TODO: return total of all nums; empty → 0
  return 0;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. Parse each non-empty line as a finite number
    // 2. On failure → ERROR: invalid number
    // 3. sum(...values); print Sum: <total>
    process.stdout.write("Not implemented yet\n");
  });
}

main();
