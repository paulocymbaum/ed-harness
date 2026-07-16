/**
 * Defaults Merge
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

function mergeDefaults(defaults, overrides) {
  // TODO: return Object.assign({}, defaults, overrides) — do not mutate sources
  throw new Error("Not implemented");
}

async function main() {
  const raw = await readStdin();
  if (raw.trim().length === 0) return fail("missing input");

  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const defaultsLine = (lines[0] ?? "").trim();
  const overridesLine = (lines[1] ?? "").trim();

  if (defaultsLine.length === 0) return fail("missing input");
  if (overridesLine.length === 0) return fail("missing overrides");

  let defaults;
  let overrides;
  try {
    defaults = JSON.parse(defaultsLine);
    overrides = JSON.parse(overridesLine);
  } catch {
    return fail("invalid JSON");
  }

  if (defaults == null || typeof defaults !== "object" || Array.isArray(defaults)) {
    return fail("input must be a JSON object");
  }
  if (overrides == null || typeof overrides !== "object" || Array.isArray(overrides)) {
    return fail("input must be a JSON object");
  }

  const beforeDefaults = JSON.stringify(defaults);
  const beforeOverrides = JSON.stringify(overrides);

  let merged;
  try {
    merged = mergeDefaults(defaults, overrides);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "failed");
  }

  if (
    JSON.stringify(defaults) !== beforeDefaults ||
    JSON.stringify(overrides) !== beforeOverrides
  ) {
    return fail("input was mutated");
  }

  process.stdout.write(`${JSON.stringify(merged)}\n`);
}

main();
