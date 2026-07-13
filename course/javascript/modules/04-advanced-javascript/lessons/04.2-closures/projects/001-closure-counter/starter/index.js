/**
 * Closure Counter
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function createCounter(start) {
  // TODO: return { inc, dec, get } closing over a private count variable
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line.trim());
  }

  const [firstLine, ...commands] = lines;
  const counter = createCounter(Number(firstLine));
  const output = [];

  for (const command of commands) {
    if (command === "inc") counter.inc();
    else if (command === "dec") counter.dec();
    else if (command === "get") output.push(String(counter.get()));
  }

  process.stdout.write(output.join("\n") + (output.length ? "\n" : ""));
}

main();
