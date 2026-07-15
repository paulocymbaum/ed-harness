/**
 * Own Key Checker
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classifyKey(child, key) {
  // TODO: "own" if Object.hasOwn(child, key); else "inherited" if key in child; else "missing"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }

  const [parentLine, ownLine, keyLine] = lines;
  const parent = JSON.parse(parentLine);
  const ownProps = JSON.parse(ownLine);
  const key = keyLine.trim();

  const child = Object.create(parent);
  Object.assign(child, ownProps);

  process.stdout.write(classifyKey(child, key) + "\n");
}

main();
