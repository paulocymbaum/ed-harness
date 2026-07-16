/**
 * Config Unpacker
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

function fail(message) {
  process.stdout.write(`ERROR: ${message}\n`);
}

function unpackConfig(input) {
  // TODO: destructure host, port, env (default "development"); validate; return { host, port, env }
  throw new Error("Not implemented");
}

async function main() {
  const raw = (await readStdin()).trim();
  if (raw.length === 0) return fail("missing input");

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return fail("invalid JSON");
  }

  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return fail("input must be a JSON object");
  }

  let result;
  try {
    result = unpackConfig(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main();
