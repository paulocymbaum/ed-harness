/**
 * Type Tag Classifier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function describe(value) {
  // TODO: null → "null"; Array.isArray → "array"; else typeof
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const value = JSON.parse(line);
    process.stdout.write(describe(value) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
