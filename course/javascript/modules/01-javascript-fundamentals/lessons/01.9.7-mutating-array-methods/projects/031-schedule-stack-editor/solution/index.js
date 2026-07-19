/**
 * Schedule Stack Editor — reference solution
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
  const front = lines[0] ?? "";
  const end = lines[1] ?? "";
  const middleReplace = lines[2] ?? "";
  const days = ["Tue", "Wed"];
  days.unshift(front);
  days.push(end);

  let wedIndex = -1;
  for (let i = 0; i < days.length; i++) {
    if (days[i] === "Wed") {
      wedIndex = i;
      break;
    }
  }
  days.splice(wedIndex, 1, middleReplace);

  let joined = "";
  for (let i = 0; i < days.length; i++) {
    if (i > 0) joined += " ";
    joined += days[i];
  }
  process.stdout.write(joined + "\n");
  process.stdout.write(String(days.length) + "\n");
}

main();
