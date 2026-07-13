/**
 * OA Readiness Score
 * node starter/index.js < starter/sample.input
 */

const readline = require("node:readline");

const READINESS_THRESHOLD = 70;
const SIGNAL_WEIGHT = 20;
const MAX_SCORE = 100;

function computeReadinessScore(hours, ipk, edges, drills) {
  // TODO: score = hours + SIGNAL_WEIGHT * ipk + SIGNAL_WEIGHT * edges + SIGNAL_WEIGHT * drills
  // TODO: cap the result at MAX_SCORE
  return 0;
}

function main() {
  const rl = readline.createInterface({ input: process.stdin });

  rl.on("line", (line) => {
    // TODO: parse "hours ipk edges drills" from the line
    // TODO: call computeReadinessScore, compare against READINESS_THRESHOLD, print "<label> <score>"
    process.stdout.write("Not implemented yet\n");
    rl.close();
  });
}

main();
