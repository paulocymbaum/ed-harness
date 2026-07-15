/**
 * Microtask Before Timer — reference solution
 */

function main() {
  const order = [];
  function log(label) {
    order.push(label);
  }

  log("start");

  Promise.resolve().then(() => {
    log("micro");
  });

  setTimeout(() => {
    log("timer");
    const microBefore =
      order.indexOf("micro") !== -1 &&
      order.indexOf("timer") !== -1 &&
      order.indexOf("micro") < order.indexOf("timer");
    process.stdout.write(`order: ${order.join(" ")}\n`);
    process.stdout.write("rule: microtasks drain before the next task\n");
    process.stdout.write(`micro_before_timer: ${microBefore}\n`);
  }, 0);

  log("end");
}

main();
