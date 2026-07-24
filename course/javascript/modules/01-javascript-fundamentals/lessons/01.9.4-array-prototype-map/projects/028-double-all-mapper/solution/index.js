/**
 * Double All Mapper — reference solution
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
  const n = Number(lines[0]);
  if (!Number.isFinite(n) || n < 0) {
    process.stdout.write("ERROR: invalid count\n");
    return;
  }
  const nums = [];
  for (let i = 0; i < n; i++) {
    const v = Number(lines[i + 1]);
    if (!Number.isFinite(v)) {
      process.stdout.write("ERROR: invalid number\n");
      return;
    }
    nums[nums.length] = v;
  }
  function double(x) {
    return x * 2;
  }
  const doubled = nums.map(double);
  for (const d of doubled) process.stdout.write(String(d) + "\n");
}

main();
