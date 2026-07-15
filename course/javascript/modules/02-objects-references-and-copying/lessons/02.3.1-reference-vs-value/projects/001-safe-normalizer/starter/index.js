/**
 * Safe Normalizer
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

/**
 * Return a cleaned copy of `input`. Must not mutate `input` or nested values.
 * @param {object} input
 * @returns {object}
 */
function normalize(input) {
  // TODO: validate fields, return a NEW object (new tags array, profile, meta)
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

  const before = JSON.stringify(input);

  let out;
  try {
    out = normalize(input);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "invalid input");
  }

  if (JSON.stringify(input) !== before) return fail("input was mutated");
  process.stdout.write(`${JSON.stringify(out)}\n`);
}

main();
