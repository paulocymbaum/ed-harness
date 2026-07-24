/**
 * Unique Tag Builder — reference solution
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
  const tags = [];
  for (let i = 0; i < n; i++) tags[tags.length] = lines[i + 1] ?? "";
  const unique = [];
  for (const t of new Set(tags)) unique[unique.length] = t;
  for (const t of unique) process.stdout.write(t + "\n");
  process.stdout.write(String(unique.length) + "\n");
}

main();
