/**
 * Shadow Probe
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

// TODO: keep this outer binding
let marker = "outer";

function probe(marker) {
  // TODO: return the parameter (shadows outer marker)
  return marker;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. Trim first line; empty → ERROR: empty marker
    // 2. const inner = probe(arg)
    // 3. Print "inner: " + inner and "outer: " + marker
    process.stdout.write("Not implemented yet\n");
  });
}

main();
