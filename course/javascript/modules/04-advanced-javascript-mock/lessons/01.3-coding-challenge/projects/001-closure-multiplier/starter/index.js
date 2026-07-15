/**
 * Closure Multiplier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function createMultiplier(base) {
  // TODO: return { mul, get } closing over a private factor variable (starts at 1)
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }

  const [firstLine, ...commands] = lines;
  const multiplier = createMultiplier(Number(firstLine));
  const output = [];

  for (const command of commands) {
    if (command === "get") {
      output.push(String(multiplier.get()));
    } else if (command.startsWith("mul ")) {
      const [, amount] = command.split(" ");
      multiplier.mul(Number(amount));
    }
  }

  process.stdout.write(output.join("\n") + (output.length ? "\n" : ""));
}

main();
