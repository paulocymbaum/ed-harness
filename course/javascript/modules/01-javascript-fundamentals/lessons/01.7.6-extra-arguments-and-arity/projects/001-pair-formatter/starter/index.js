/**
 * Pair Formatter
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function formatPair(a, b) {
  // TODO: return a + "|" + b
  return a;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. Split first line on whitespace into tokens
    // 2. If tokens.length < 2 → ERROR: need two tokens
    // 3. Call formatPair(...tokens) — extras must be ignored by the function
    // 4. Print the result
    process.stdout.write("Not implemented yet\n");
  });
}

main();
