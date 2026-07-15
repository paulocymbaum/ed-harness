/**
 * Sliding Window Max Sum
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function maxWindowSum(numbers, k) {
  // TODO: return the maximum sum of any contiguous window of length k
  // using a sliding window (running sum), or null if k is invalid.
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }

  const numbers = lines[0].split(/\s+/).filter(Boolean).map(Number);
  const k = Number(lines[1]);

  if (k < 1 || k > numbers.length) {
    process.stdout.write("ERROR\n");
    return;
  }

  const result = maxWindowSum(numbers, k);
  process.stdout.write(String(result) + "\n");
}

main();
