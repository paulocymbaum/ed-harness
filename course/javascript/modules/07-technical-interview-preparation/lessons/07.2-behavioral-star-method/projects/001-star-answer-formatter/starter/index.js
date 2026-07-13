/**
 * STAR Answer Formatter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

const STAR_LABELS = ["Situation", "Task", "Action", "Result"];

function formatStarLines(lines) {
  // TODO: pair each label in STAR_LABELS with the matching line by index,
  // returning an array of "<Label>: <text>" strings
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  const output = formatStarLines(lines);
  process.stdout.write(output.join("\n") + (output.length ? "\n" : ""));
}

main();
