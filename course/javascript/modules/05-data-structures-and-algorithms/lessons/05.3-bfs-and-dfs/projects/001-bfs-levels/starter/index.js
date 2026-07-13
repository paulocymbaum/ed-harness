/**
 * BFS Levels
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function bfsOrder(adjacencyList, start) {
  // TODO: use a queue (FIFO) to visit nodes level by level.
  // Mark a node visited as soon as it is enqueued to avoid revisiting it.
  // Return an array of node indices in the order they were visited.
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const adjacencyList = JSON.parse(lines[0]);
  const start = Number(lines[1]);

  const order = bfsOrder(adjacencyList, start);
  process.stdout.write(order.join(" ") + "\n");
}

main();
