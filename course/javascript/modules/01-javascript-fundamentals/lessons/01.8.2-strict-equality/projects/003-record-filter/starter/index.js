/**
 * Equality Judge
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

function judge(a, b) {
  // TODO: return array of three lines:
  // "loose: <bool>", "strict: <bool>", and prefer line for == vs ===
  throw new Error("Not implemented");
}

function runDemo() {
  const pairs = [
    [[], 0],
    [{}, {}],
  ];
  for (const [a, b] of pairs) {
    for (const line of judge(a, b)) {
      process.stdout.write(line + "\n");
    }
    process.stdout.write("---\n");
  }
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length === 1 && lines[0].trim() === "demo") {
      runDemo();
      rl.close();
      return;
    }
    if (lines.length < 2) continue;
    const a = parseValue(lines[0]);
    const b = parseValue(lines[1]);
    for (const out of judge(a, b)) {
      process.stdout.write(out + "\n");
    }
    rl.close();
    return;
  }
  rl.close();
}

main();
