/**
 * Passing Score Keeper — reference solution
 */

const readline = require("readline");

async function readAllLines() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) lines.push(line);
  return lines;
}

async function main() {
  const lines = await readAllLines();
  const threshold = Number(lines[0]);
  const n = Number(lines[1]);
  if (!Number.isFinite(threshold)) {
    process.stdout.write("ERROR: invalid number\n");
    return;
  }
  if (!Number.isFinite(n) || n < 0) {
    process.stdout.write("ERROR: invalid count\n");
    return;
  }
  const scores = [];
  for (let i = 0; i < n; i++) {
    const v = Number(lines[i + 2]);
    if (!Number.isFinite(v)) {
      process.stdout.write("ERROR: invalid number\n");
      return;
    }
    scores[scores.length] = v;
  }
  function isPassing(score) {
    return score >= threshold;
  }
  const passing = scores.filter(isPassing);
  for (const s of passing) process.stdout.write(String(s) + "\n");
}

main();
