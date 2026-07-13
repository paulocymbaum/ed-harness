/**
 * Big-O Classifier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(pattern) {
  // TODO: pattern is "single-loop" | "nested-loop" | "binary-search" | "constant"
  // Map to: "O(n)" | "O(n^2)" | "O(log n)" | "O(1)"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const [pattern] = lines;
  process.stdout.write(classify(pattern) + "\n");
}

main();
