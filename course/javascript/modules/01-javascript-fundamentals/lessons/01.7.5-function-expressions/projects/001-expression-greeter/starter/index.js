/**
 * Expression Greeter
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

// TODO: assign a function expression (not a declaration, not an arrow)
const formatGreeting = function (name) {
  // TODO: return "Hello, " + name + "!"
  return name;
};

function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    lines.push(line);
  });

  rl.on("close", () => {
    // TODO:
    // 1. Take first line, trim
    // 2. Empty → ERROR: empty name
    // 3. Else print formatGreeting(name)
    process.stdout.write("Not implemented yet\n");
  });
}

main();
