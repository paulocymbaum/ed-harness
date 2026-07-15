/**
 * Clarify Gate
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function evaluateReadiness(lines) {
  // TODO: return "ready" if some line includes "?" AND some line includes
  // "constraint" or "example" (case-insensitive); otherwise return "ask-more"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  process.stdout.write(evaluateReadiness(lines) + "\n");
}

main();
