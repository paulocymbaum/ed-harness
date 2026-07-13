/**
 * Badge Progress Reporter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(earned, total) {
  // TODO: earned and total are non-negative integers, earned <= total
  // Rules: earned === total -> "complete"; earned < total -> "in-progress"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const earned = Number(lines[0]);
  const total = Number(lines[1]);
  const status = classify(earned, total);
  process.stdout.write(`${status} ${earned}/${total}\n`);
}

main();
