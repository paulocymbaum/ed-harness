/**
 * Microtask Before Timer
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

function main() {
  const order = [];
  function log(label) {
    order.push(label);
  }

  // TODO:
  // 1. log("start")
  // 2. schedule Promise microtask that log("micro")
  // 3. schedule setTimeout(0) that log("timer") then prints the three README lines
  // 4. log("end")
  //
  // order / micro_before_timer must come from the `order` array at print time.

  process.stdout.write("Not implemented yet\n");
}

main();
