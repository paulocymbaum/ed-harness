/**
 * Stack Trace Reporter
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("node:readline");

const MAX_DEPTH = 32;

/**
 * Op graphs — simulate these; do not hardcode answer strings.
 * @typedef {{ type: "log", label: string } | { type: "call", target: string }} Op
 * @typedef {{ probe: string | null, functions: Record<string, Op[]>, entry: Op[] }} Snippet
 */
const SNIPPETS = {
  basic: {
    probe: "second",
    functions: {
      second: [{ type: "log", label: "second" }],
      first: [
        { type: "log", label: "first" },
        { type: "call", target: "second" },
        { type: "log", label: "after second" },
      ],
    },
    entry: [
      { type: "log", label: "start" },
      { type: "call", target: "first" },
      { type: "log", label: "end" },
    ],
  },
  nested: {
    probe: "b",
    functions: {
      a: [
        { type: "log", label: "a" },
        { type: "call", target: "b" },
        { type: "log", label: "a done" },
      ],
      b: [{ type: "log", label: "b" }],
    },
    entry: [{ type: "call", target: "a" }],
  },
  "overflow-note": {
    probe: null,
    functions: {
      recurse: [{ type: "call", target: "recurse" }],
    },
    entry: [{ type: "call", target: "recurse" }],
  },
};

/**
 * Simulate calls/logs. Return frames top→bottom at probe, or throw Error("stack would overflow").
 * @param {Snippet} snippet
 * @returns {string[]}
 */
function stackAtProbe(snippet) {
  // TODO:
  // - stack = []
  // - on call: if stack.length >= MAX_DEPTH → throw; else push, run body, pop
  // - on log matching snippet.probe → capture top→bottom frames
  // - exec snippet.entry; return captured frames
  throw new Error("Not implemented");
}

function main() {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    const id = line.trim();
    const snippet = SNIPPETS[id];
    if (!snippet) {
      process.stdout.write("ERROR: unknown snippet\n");
      rl.close();
      return;
    }
    try {
      const frames = stackAtProbe(snippet);
      process.stdout.write("Stack: " + frames.join(" ") + "\n");
    } catch (e) {
      const message = e instanceof Error ? e.message : "stack would overflow";
      if (message === "stack would overflow") {
        process.stdout.write("ERROR: stack would overflow\n");
      } else {
        process.stdout.write("ERROR: " + message + "\n");
      }
    }
    rl.close();
  });
}

main();
