/**
 * Property Reader
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

function readProperty(obj, key) {
  // TODO: return obj[key]; treat undefined as missing
  throw new Error("Not implemented");
}

async function main() {
  const raw = await readStdin();
  if (raw.trim().length === 0) return fail("missing input");

  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const jsonLine = (lines[0] ?? "").trim();
  const key = (lines[1] ?? "").trim();

  let input;
  try {
    input = JSON.parse(jsonLine);
  } catch {
    return fail("invalid JSON");
  }

  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return fail("input must be a JSON object");
  }

  if (key.length === 0) return fail("missing key");

  let value;
  try {
    value = readProperty(input, key);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  if (value === undefined) return fail("key not found");

  process.stdout.write(`${JSON.stringify(value)}\n`);
}

main();
