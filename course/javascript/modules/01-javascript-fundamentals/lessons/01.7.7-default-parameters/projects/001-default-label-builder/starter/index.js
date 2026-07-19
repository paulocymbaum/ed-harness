/**
 * Default Label Builder
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function buildLabel(text, prefix /* TODO: default = "TAG" */) {
  // TODO: return prefix + ":" + text
  return text;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. text = trim(lines[0]); empty → ERROR: empty text
    // 2. If lines.length >= 2, call buildLabel(text, trim(lines[1]))
    // 3. Else call buildLabel(text) so default prefix applies
    // 4. Print result
    process.stdout.write("Not implemented yet\n");
  });
}

main();
