/**
 * Implementation Checklist Counter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function countChecklist(lines) {
  // TODO: lines is an array of raw strings (may be empty)
  // Rules: a trimmed line starting with "[x]" counts as done; "[ ]" counts as todo; anything else is ignored
  // Return { done: number, todo: number }
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  const { done, todo } = countChecklist(lines);
  process.stdout.write(`done=${done} todo=${todo}\n`);
}

main();
