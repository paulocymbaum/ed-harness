/**
 * OA Timer Mode
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function mode(minutes) {
  // TODO: minutes is a non-negative integer
  // Rules: minutes < 15 -> "rush"; minutes < 45 -> "pace"; else -> "plan"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const minutes = Number(lines[0]);
  process.stdout.write(mode(minutes) + "\n");
}

main();
