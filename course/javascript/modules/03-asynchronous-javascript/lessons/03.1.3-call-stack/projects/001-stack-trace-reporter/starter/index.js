/**
 * Stack Trace Reporter
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

function reportStack(snippetId) {
  // TODO: map snippetId → stack string or error message
  return "Not implemented yet";
}

function main() {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    // TODO: print Stack: ... or ERROR: ...
    process.stdout.write(`${reportStack(line.trim())}\n`);
    rl.close();
  });
}

main();
