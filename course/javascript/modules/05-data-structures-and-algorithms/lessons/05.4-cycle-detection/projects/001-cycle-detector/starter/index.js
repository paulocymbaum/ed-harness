/**
 * Cycle Detector
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function hasCycle(next, start) {
  // TODO: next[i] is the index the node at i points to, or -1 for "end".
  // Detect whether following next pointers from start ever revisits a node
  // before reaching -1. Use Floyd's tortoise-and-hare or a visited set.
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const next = lines[0].split(/\s+/).map(Number);

  process.stdout.write((hasCycle(next, 0) ? "cycle" : "acyclic") + "\n");
}

main();
