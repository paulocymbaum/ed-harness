/**
 * Stack Trace Reporter — reference solution
 */

const readline = require("node:readline");

const MAX_DEPTH = 32;

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

function stackAtProbe(snippet) {
  const stack = [];
  let captured = null;

  function exec(ops) {
    for (const op of ops) {
      if (op.type === "log") {
        if (snippet.probe != null && op.label === snippet.probe) {
          captured = stack.slice().reverse();
        }
        continue;
      }
      if (op.type === "call") {
        if (stack.length >= MAX_DEPTH) {
          throw new Error("stack would overflow");
        }
        const body = snippet.functions[op.target];
        if (!body) throw new Error("unknown function: " + op.target);
        stack.push(op.target);
        exec(body);
        stack.pop();
      }
    }
  }

  exec(snippet.entry);

  if (captured == null) {
    throw new Error("stack would overflow");
  }
  return captured;
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
