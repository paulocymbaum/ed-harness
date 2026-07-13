/**
 * Edge Case Flag Reporter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function reportFlags(tokens) {
  // TODO: tokens is an array of strings split from one line
  // Keep only the recognized categories: "empty", "zero", "neg", "single"
  // De-duplicate, sort alphabetically, join with a single space; return "none" if empty
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const tokens = (lines[0] || "").split(/\s+/).filter(Boolean);
  process.stdout.write(reportFlags(tokens) + "\n");
}

main();
