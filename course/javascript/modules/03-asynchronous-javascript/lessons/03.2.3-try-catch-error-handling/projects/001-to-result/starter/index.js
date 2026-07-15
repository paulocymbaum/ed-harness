/**
 * To Result
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

async function toResult(promise) {
  // TODO: await promise; return { ok: true, value } or { ok: false, error }
  // Must never throw
  throw new Error("Not implemented");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const mode = line.trim();
    if (mode === "ok") {
      const result = await toResult(Promise.resolve(42));
      process.stdout.write("ok:" + result.value + "\n");
    } else if (mode === "fail") {
      const result = await toResult(Promise.reject(new Error("boom")));
      process.stdout.write("err:" + result.error.message + "\n");
    } else {
      process.stdout.write("ERROR: use ok or fail\n");
    }
    break;
  }
  rl.close();
}

main();
