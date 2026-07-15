/**
 * CAP Trade-off Labeler
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function sacrificedGuarantee(pair) {
  // TODO: map "CP" -> "availability", "AP" -> "consistency", "CA" -> "partition-tolerance"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    process.stdout.write(sacrificedGuarantee(line.trim()) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
