/**
 * Rank Tier Classifier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(rank) {
  // TODO: rank is a positive integer
  // Rules: rank <= 100 -> "top-100"; rank <= 1000 -> "top-1000"; else -> "open"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const rank = Number(lines[0]);
  process.stdout.write(classify(rank) + "\n");
}

main();
