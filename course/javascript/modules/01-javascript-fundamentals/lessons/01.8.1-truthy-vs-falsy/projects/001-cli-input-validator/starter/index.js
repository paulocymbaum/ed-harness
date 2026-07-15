/**
 * Truthy Classifier
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(value) {
  // TODO: return "truthy" or "falsy" using Boolean(value)
  throw new Error("Not implemented");
}

function naiveGate(value) {
  // TODO: return "blocked" if !value, else "allowed"
  throw new Error("Not implemented");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed === "done") break;
    let value;
    try {
      value = JSON.parse(trimmed);
    } catch {
      process.stdout.write("ERROR: invalid JSON\n");
      continue;
    }
    process.stdout.write("classify: " + classify(value) + "\n");
    if (value === 0) {
      process.stdout.write("naiveGate: " + naiveGate(value) + "\n");
      process.stdout.write("note: 0 is valid but falsy\n");
    }
  }
  rl.close();
}

main();
