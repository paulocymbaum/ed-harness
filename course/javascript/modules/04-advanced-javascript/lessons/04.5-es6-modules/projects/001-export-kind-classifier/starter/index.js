/**
 * Export Kind Classifier
 *
 * Entrypoint: node starter/index.js < starter/sample.input
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function classify(line) {
  // TODO: "export default" -> "default-export"
  //       "export" (default already handled) -> "named-export"
  //       "import" + "{" -> "named-import"
  //       "import" (no brace) -> "default-import"
  throw new Error("Not implemented yet");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    process.stdout.write(classify(line.trim()) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
