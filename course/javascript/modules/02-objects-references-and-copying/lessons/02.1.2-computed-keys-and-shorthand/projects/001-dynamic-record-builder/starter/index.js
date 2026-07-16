/**
 * Dynamic Record Builder
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

function buildRecord(pairs) {
  // TODO: build object using computed keys from [{ key, value }, ...]
  throw new Error("Not implemented");
}

async function main() {
  const raw = await readStdin();
  if (raw.trim().length === 0) return fail("missing input");

  const lines = raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return fail("missing input");

  const pairs = [];
  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq === -1) return fail("invalid pair");
    const key = line.slice(0, eq);
    const value = line.slice(eq + 1);
    if (key.length === 0) return fail("empty key");
    pairs.push({ key, value });
  }

  let record;
  try {
    record = buildRecord(pairs);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  process.stdout.write(`${JSON.stringify(record)}\n`);
}

main();
