/**
 * TDZ Access Reporter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(kind, timing) {
  // TODO: kind is "var" | "let" | "const"; timing is "early" | "after"
  // Rules: var+early -> "undefined"; let/const+early -> "ReferenceError"; any+after -> "ok"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const [kind, timing] = lines;
  process.stdout.write(classify(kind, timing) + "\n");
}

main();
