/**
 * Output Order Predictor — reference solution
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

function runBasic({ log, scheduleMicro, scheduleTask, done }) {
  log("A");
  scheduleMicro(() => log("micro"));
  scheduleTask(() => {
    log("timer");
    done();
  });
  log("B");
}

function runAsyncAwait({ log, scheduleMicro, scheduleTask, done }) {
  log("A");
  scheduleMicro(() => log("B"));
  log("C");
  scheduleTask(() => done());
}

function runChainedMicrotasks({ log, scheduleMicro, scheduleTask, done }) {
  scheduleMicro(() => {
    log("m1");
    scheduleMicro(() => log("m2"));
  });
  scheduleTask(() => {
    log("t1");
    done();
  });
}

function runTrick({ log, scheduleMicro, scheduleTask, done }) {
  log("start");
  scheduleMicro(() => log("micro"));
  scheduleTask(() => {
    log("timer");
    done();
  });
  log("end");
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
