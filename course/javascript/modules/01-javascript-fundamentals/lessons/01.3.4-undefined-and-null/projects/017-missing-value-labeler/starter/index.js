/**
 * Optional Field Describer
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function describeField(value) {
  // TODO:
  // undefined → "not provided"
  // null → "explicitly empty"
  // else → "has value: " + String(value)
  throw new Error("Not implemented");
}

function parseLine(line) {
  const trimmed = line.trim();
  if (trimmed === "undefined") return undefined;
  return JSON.parse(trimmed);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    if (line.trim() === "done") break;
    try {
      const value = parseLine(line);
      process.stdout.write(describeField(value) + "\n");
    } catch {
      process.stdout.write("ERROR: invalid input\n");
    }
  }
  rl.close();
}

main();
