/**
 * Log Level Slicer — reference solution
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
  const levels = [lines[0], lines[1], lines[2], lines[3]];
  const mid = levels.slice(1, 3);
  process.stdout.write(String(levels.includes("error")) + "\n");
  process.stdout.write(mid.join(" | ") + "\n");
  process.stdout.write(levels.join(",") + "\n");
}

main();
