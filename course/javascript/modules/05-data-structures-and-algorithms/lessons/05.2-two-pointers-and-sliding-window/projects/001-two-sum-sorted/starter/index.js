/**
 * Two Sum Sorted
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function twoSumSortedIndices(arr, target) {
  // TODO: use two pointers (left at start, right at end) to find the pair
  // that sums to target. Return [leftIndex, rightIndex] or null if none exists.
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const arr = lines[0].split(/\s+/).map(Number);
  const target = Number(lines[1]);

  const result = twoSumSortedIndices(arr, target);
  process.stdout.write((result ? result.join(" ") : "none") + "\n");
}

main();
