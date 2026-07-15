/**
 * STAR Line Validator
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

const MIN_SLOT_LENGTH = 3;
const STAR_SLOT_COUNT = 4;

function isFilledSlot(line) {
  // TODO: trim the line and check it is non-empty with length >= MIN_SLOT_LENGTH
  return false;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < STAR_SLOT_COUNT) return;

    // TODO: check isFilledSlot for all four lines and print "valid" or "invalid"
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
