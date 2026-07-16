/**
 * Score Pipeline
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. Parse threshold (line 0), n (line 1), then n scores
    // 2. Validate with Number.isFinite — else ERROR: invalid number
    // 3. const isPassing = (s) => s >= threshold
    // 4. const labelPass = (s) => "Pass:" + s
    // 5. filter + map, print each label
    process.stdout.write("Not implemented yet\n");
  });
}

main();
