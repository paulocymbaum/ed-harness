/**
 * Safe Divider
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

function divide(a, b) {
  // TODO: throw new Error("Cannot divide by zero") when b === 0; otherwise return a / b
  return a / b;
}

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
    if (lines.length < 2) return;

    // TODO: parse a/b, validate with Number.isFinite, try/catch around divide
    // Success → Result: <quotient>
    // Failure → ERROR: <err.message>
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
