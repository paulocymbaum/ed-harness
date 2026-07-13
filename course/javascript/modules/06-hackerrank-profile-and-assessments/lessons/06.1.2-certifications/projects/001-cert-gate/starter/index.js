/**
 * Cert Gate
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(outcome) {
  // TODO: outcome is "passed" | "failed"
  // Rules: passed -> "verified"; failed -> "not-verified"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const [outcome] = lines;
  process.stdout.write(classify(outcome) + "\n");
}

main();
