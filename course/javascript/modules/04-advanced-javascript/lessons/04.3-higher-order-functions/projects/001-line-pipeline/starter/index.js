/**
 * Line Pipeline
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function mapUpper(lines) {
  // TODO: return a new array with every line uppercased, using .map()
  throw new Error("Not implemented yet");
}

function filterNonEmpty(lines) {
  // TODO: return a new array keeping only lines with length > 0, using .filter()
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  const [operation, ...batch] = lines;
  const result = operation === "upper" ? mapUpper(batch) : filterNonEmpty(batch);

  process.stdout.write(result.join("\n") + (result.length ? "\n" : ""));
}

main();
