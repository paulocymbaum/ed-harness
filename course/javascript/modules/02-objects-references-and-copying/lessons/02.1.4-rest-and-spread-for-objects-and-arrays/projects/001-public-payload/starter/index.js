/**
 * Public Payload
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

function toPublicPayload(input) {
  // TODO: rest-drop password/secret; spread with defaults { role: "user" }; do not mutate input
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

  const before = JSON.stringify(input);

  let result;
  try {
    result = toPublicPayload(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  if (JSON.stringify(input) !== before) return fail("input was mutated");

  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main();
