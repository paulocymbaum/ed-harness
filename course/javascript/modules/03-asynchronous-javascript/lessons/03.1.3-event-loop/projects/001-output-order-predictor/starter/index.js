/**
 * Output Order Predictor
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

/**
 * Harness: log() records labels tagged by the current phase.
 * scheduleMicro / scheduleTask flip the phase when their callbacks run.
 */
function createHarness() {
  let phase = "sync";
  const order = [];
  const classifications = [];

  function log(label) {
    order.push(label);
    classifications.push(`${label}:${phase}`);
  }

  function scheduleMicro(fn) {
    Promise.resolve().then(() => {
      phase = "microtask";
      fn();
    });
  }

  function scheduleTask(fn) {
    setTimeout(() => {
      phase = "task";
      fn();
    }, 0);
  }

  function run(setup) {
    return new Promise((resolve) => {
      phase = "sync";
      order.length = 0;
      classifications.length = 0;

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        resolve({
          order: order.slice(),
          classifications: classifications.slice(),
        });
      };

      setup({ log, scheduleMicro, scheduleTask, done });
    });
  }

  return { run };
}

function formatSnippet(name, observed, explanation) {
  return [
    `=== ${name} ===`,
    `order: ${observed.order.join(" ")}`,
    ...observed.classifications.map((c) => `  ${c}`),
    `explanation: ${explanation}`,
  ].join("\n");
}

/** @param {{ log: Function, scheduleMicro: Function, scheduleTask: Function, done: Function }} h */
function runBasic(h) {
  // TODO: A (sync), micro (microtask), timer (task + done()), B (sync)
  throw new Error("Not implemented");
}

/** @param {{ log: Function, scheduleMicro: Function, scheduleTask: Function, done: Function }} h */
function runAsyncAwait(h) {
  // TODO: A (sync), scheduleMicro for B, C (sync), and finish after B
  // Hint: scheduleTask(done) is wrong here — finish from the microtask after logging B,
  // or schedule a zero timer only to call done after micros drain.
  throw new Error("Not implemented");
}

/** @param {{ log: Function, scheduleMicro: Function, scheduleTask: Function, done: Function }} h */
function runChainedMicrotasks(h) {
  // TODO: m1 schedules m2; t1 is a task that calls done()
  throw new Error("Not implemented");
}

/** @param {{ log: Function, scheduleMicro: Function, scheduleTask: Function, done: Function }} h */
function runTrick(h) {
  // TODO: start, micro, timer(+done), end
  throw new Error("Not implemented");
}

async function main() {
  const demos = [
    {
      name: "basic",
      runner: runBasic,
      explanation:
        "Sync logs run on the call stack first. Promise reactions are microtasks and drain before the setTimeout task runs.",
    },
    {
      name: "async-await",
      runner: runAsyncAwait,
      explanation:
        "main() runs until await, which schedules the rest as a microtask. C prints before B resumes.",
    },
    {
      name: "chained-microtasks",
      runner: runChainedMicrotasks,
      explanation:
        "Microtasks m1 and m2 drain completely before task t1 from setTimeout.",
    },
    {
      name: "trick",
      runner: runTrick,
      explanation:
        "Microtasks always run before the next task, so micro prints before timer even with setTimeout(0).",
    },
  ];

  for (const demo of demos) {
    const harness = createHarness();
    const observed = await harness.run(demo.runner);
    process.stdout.write(formatSnippet(demo.name, observed, demo.explanation) + "\n\n");
  }
}

main();
