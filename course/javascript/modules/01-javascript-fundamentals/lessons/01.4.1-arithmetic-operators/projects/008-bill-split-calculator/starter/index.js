/**
 * Expression Evaluator
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function parseOperand(raw) {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function applyOp(a, op, b) {
  // TODO: implement +, -, *, /, %, ** and string concat for + when not both numbers
  // Return a result value or { error: "..." }
  throw new Error("Not implemented");
}

function evalPrecedence(expr) {
  // TODO: optional — handle forms like "2 + 3 * 4" if required by README
  throw new Error("Not implemented");
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
  }
  rl.close();

  // TODO: wire stdin protocol from README (3-line a/op/b or single precedence expression)
  // Use parseOperand() so "\"10\"" becomes the string 10 for concat cases.
  process.stdout.write("Not implemented yet\n");
}

main();
