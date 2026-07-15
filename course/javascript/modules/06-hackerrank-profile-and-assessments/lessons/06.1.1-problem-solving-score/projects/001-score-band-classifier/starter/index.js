/**
 * Score Band Classifier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(score) {
  // TODO: score is an integer 0-100
  // Rules: score < 40 -> "beginner"; 40 <= score <= 69 -> "intermediate"; score >= 70 -> "advanced"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const score = Number(lines[0]);
  process.stdout.write(classify(score) + "\n");
}

main();
