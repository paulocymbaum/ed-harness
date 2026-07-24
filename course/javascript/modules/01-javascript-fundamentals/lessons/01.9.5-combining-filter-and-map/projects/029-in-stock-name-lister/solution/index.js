/**
 * In Stock Name Lister — reference solution
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
  const products = [];
  for (let i = 0; i < n; i++) {
    const raw = lines[i + 1] ?? "";
    const sp = raw.lastIndexOf(" ");
    if (sp === -1) {
      process.stdout.write("ERROR: invalid row\n");
      return;
    }
    const name = raw.slice(0, sp);
    const flag = raw.slice(sp + 1);
    if (flag !== "true" && flag !== "false") {
      process.stdout.write("ERROR: invalid row\n");
      return;
    }
    products[products.length] = { name, inStock: flag === "true" };
  }
  function isInStock(p) {
    return p.inStock === true;
  }
  function toName(p) {
    return p.name;
  }
  const names = products.filter(isInStock).map(toName);
  for (const name of names) process.stdout.write(name + "\n");
}

main();
