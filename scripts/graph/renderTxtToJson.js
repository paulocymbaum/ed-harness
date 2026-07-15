const fs = require("fs");
const path = require("path");
const { parseMindmapText } = require("./parseMindmap");

function usage() {
  const cmd = path.basename(process.argv[1]);
  return [
    `Usage: node scripts/graph/${cmd} <inputTxt> [outputJson]`,
    `       node scripts/graph/${cmd} --all`,
    ``,
    `Examples:`,
    `  node scripts/graph/${cmd} graph/courses/javascript.graph.txt`,
    `  node scripts/graph/${cmd} graph/courses/javascript.graph.txt graph/courses/javascript.graph.json`,
    `  node scripts/graph/${cmd} --all`,
  ].join("\n");
}

function renderOne(inputPath, outputPath) {
  const text = fs.readFileSync(inputPath, "utf8");
  const graph = parseMindmapText(text);
  const json = JSON.stringify(graph, null, 2);

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, json, "utf8");
    return outputPath;
  }

  process.stdout.write(`${json}\n`);
  return null;
}

function renderAll(repoRoot) {
  const coursesDir = path.join(repoRoot, "graph", "courses");
  if (!fs.existsSync(coursesDir)) {
    process.stderr.write(`NOT_FOUND: ${coursesDir}\n`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(coursesDir)
    .filter((name) => name.endsWith(".graph.txt"))
    .sort();

  if (!files.length) {
    process.stderr.write(`NO_GRAPHS: ${coursesDir}\n`);
    process.exit(1);
  }

  for (const name of files) {
    const inputPath = path.join(coursesDir, name);
    const outputPath = path.join(coursesDir, name.replace(/\.graph\.txt$/, ".graph.json"));
    renderOne(inputPath, outputPath);
    process.stdout.write(`Wrote ${path.relative(repoRoot, outputPath)}\n`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args[0] === "--all") {
    renderAll(process.cwd());
    return;
  }

  const input = args[0];
  const output = args[1];

  if (!input) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  const inputPath = path.resolve(process.cwd(), input);
  const outPath = output ? path.resolve(process.cwd(), output) : null;
  renderOne(inputPath, outPath);
}

if (require.main === module) main();

module.exports = { main, renderOne, renderAll };
