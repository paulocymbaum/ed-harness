/**
 * Weekday Slot Builder
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

async function readLines(count) {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length >= count) {
      rl.close();
      break;
    }
  }
  return lines;
}

async function main() {
  const lines = await readLines(5);
  // TODO: build days with an array literal from lines[0..2]
  // Print first, last, joined-after-middle-replace, then length after append
  process.stdout.write("Not implemented yet\n");
  void lines;
}

main();
