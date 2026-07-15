/**
 * Sync Trace — reference solution
 */

const readline = require("readline");

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

function syncOrder(ops) {
  const labels = [];
  for (const op of ops) {
    if (op.type === "log") labels.push(op.label);
  }
  return labels;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const id = line.trim();
    const ops = SNIPPETS[id];
    if (!ops) {
      process.stdout.write("ERROR: unknown snippet\n");
    } else {
      process.stdout.write("Sync order: " + syncOrder(ops).join(" ") + "\n");
    }
    break;
  }
  rl.close();
}

main();
