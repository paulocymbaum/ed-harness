/**
 * Sync Trace
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

/** Op graphs — walk these; do not hardcode answer strings. */
const SNIPPETS = {
  basic: [
    { type: "log", label: "A" },
    { type: "timeout", label: "B" },
    { type: "log", label: "C" },
  ],
  nested: [
    { type: "log", label: "1" },
    {
      type: "timeout",
      label: "2",
      body: [{ type: "timeout", label: "3" }],
    },
    { type: "log", label: "4" },
  ],
  chain: [
    { type: "log", label: "start" },
    { type: "log", label: "middle" },
    { type: "timeout", label: "later" },
    { type: "log", label: "end" },
  ],
};

/**
 * Return labels that run in the sync phase only.
 * @param {Array<{ type: string, label: string, body?: unknown[] }>} ops
 * @returns {string[]}
 */
function syncOrder(ops) {
  // TODO: collect type:"log" labels; skip type:"timeout" (and do not walk body)
  throw new Error("Not implemented");
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const id = line.trim();
    const ops = SNIPPETS[id];
    if (!ops) {
      process.stdout.write("ERROR: unknown snippet\n");
    } else {
      const labels = syncOrder(ops);
      process.stdout.write("Sync order: " + labels.join(" ") + "\n");
    }
    break;
  }
  rl.close();
}

main();
