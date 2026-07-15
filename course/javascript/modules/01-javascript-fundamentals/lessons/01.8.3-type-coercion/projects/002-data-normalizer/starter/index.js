/**
 * Coercion Predictor
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function parseValue(line) {
  const trimmed = line.trim();
  if (trimmed === "undefined") return undefined;
  return JSON.parse(trimmed);
}

function ruleFor(a, op, b) {
  // TODO: return the documented rule string for known pairs / operators
  throw new Error("Not implemented");
}

function compare(a, op, b) {
  // TODO: evaluate == or ===; return boolean
  throw new Error("Not implemented");
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length < 3) continue;
    const a = parseValue(lines[0]);
    const op = lines[1].trim();
    const b = parseValue(lines[2]);
    if (op !== "==" && op !== "===") {
      process.stdout.write("ERROR: invalid operator\n");
      rl.close();
      return;
    }
    const result = compare(a, op, b);
    process.stdout.write("result: " + result + "\n");
    process.stdout.write("rule: " + ruleFor(a, op, b) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
