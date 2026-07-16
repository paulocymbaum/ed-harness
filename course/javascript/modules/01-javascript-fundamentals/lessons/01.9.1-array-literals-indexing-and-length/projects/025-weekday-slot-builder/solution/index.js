/**
 * Weekday Slot Builder — reference solution
 */

const readline = require("readline");

async function readLines(count) {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length >= count) {
      rl.close();
      break;
    }
  }
  return lines;
}

async function main() {
  const lines = await readLines(5);
  const days = [lines[0], lines[1], lines[2]];

  process.stdout.write(days[0] + "\n");
  process.stdout.write(days[days.length - 1] + "\n");

  days[1] = lines[3];
  process.stdout.write(days[0] + " " + days[1] + " " + days[2] + "\n");

  days[days.length] = lines[4];
  process.stdout.write(String(days.length) + "\n");
}

main();
