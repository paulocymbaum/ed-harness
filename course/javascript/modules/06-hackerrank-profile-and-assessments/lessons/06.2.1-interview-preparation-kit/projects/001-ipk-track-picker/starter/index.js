/**
 * IPK Track Picker
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function recommend(keyword) {
  // TODO: keyword is a free-form string; only "arrays", "strings", "warmup" are recognized
  // Rules:
  //   arrays  -> "Arrays: traversal and manipulation"
  //   strings -> "Strings: parsing and building"
  //   warmup  -> "Warmup: build momentum first"
  //   other   -> "General: mixed topic practice"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }
  const [keyword] = lines;
  process.stdout.write(recommend(keyword) + "\n");
}

main();
