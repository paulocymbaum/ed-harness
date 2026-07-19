/**
 * Schedule Stack Editor
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

async function readAllLines() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) lines.push(line);
  return lines;
}

async function main() {
  const lines = await readAllLines();
  // TODO: seed Tue/Wed; unshift/push/splice; print join + length
  process.stdout.write("Not implemented yet\n");
  void lines;
}

main();
