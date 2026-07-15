/**
 * Shared Membership Checker
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

function solve(lines) {
  // TODO: implement per ../README.md
  return "Not implemented yet";
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", (line) => lines.push(line));
  rl.on("close", () => {
    process.stdout.write(`${solve(lines)}\n`);
  });
}

main();
