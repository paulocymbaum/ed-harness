/**
 * Climbing Stairs DP
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function waysToClimb(n) {
  // TODO: number of ways to climb n stairs taking 1 or 2 steps at a time.
  // Fill a table bottom-up: table[i] = table[i - 1] + table[i - 2].
  // Base cases: ways(0) = 1, ways(1) = 1.
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const n = Number(lines[0]);

  process.stdout.write(waysToClimb(n) + "\n");
}

main();
