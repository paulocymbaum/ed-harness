/**
 * Smell Scanner
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function hasSmell(lines) {
  // TODO: return true if any line matches /var |console\.log|TODO/i
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  process.stdout.write((hasSmell(lines) ? "smell" : "clean") + "\n");
}

main();
