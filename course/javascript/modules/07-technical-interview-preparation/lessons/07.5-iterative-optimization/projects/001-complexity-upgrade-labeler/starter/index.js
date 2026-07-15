/**
 * Complexity Upgrade Labeler
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function complexityTag(stage) {
  // TODO: map "brute" -> "O(n^2)", "better" -> "O(n log n)", "optimal" -> "O(n)"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    process.stdout.write(complexityTag(line.trim()) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
