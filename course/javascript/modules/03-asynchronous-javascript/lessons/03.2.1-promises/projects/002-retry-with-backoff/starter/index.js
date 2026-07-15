/**
 * Promise Chain Builder
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function fakeRead(path, callback) {
  setTimeout(() => {
    if (path === "fail") {
      callback(new Error("not found"));
      return;
    }
    callback(null, "data:" + path);
  }, 0);
}

function readAsPromise(path) {
  // TODO: wrap fakeRead in `new Promise`
  throw new Error("Not implemented");
}

function runPipeline(path) {
  // TODO: readAsPromise(path).then(...).then(...).catch(...)
  // Success shape: "<data> -> parsed -> done"
  // Failure shape: "ERROR: " + message
  throw new Error("Not implemented");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const path = line.trim();
    const result = await runPipeline(path);
    process.stdout.write(result + "\n");
    break;
  }
  rl.close();
}

main();
