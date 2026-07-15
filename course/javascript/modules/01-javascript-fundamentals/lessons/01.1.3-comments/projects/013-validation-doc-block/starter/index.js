/**
 * Commented Validator
 *
 * Entrypoint: node starter/index.js
 * Implement the behavior described in ../README.md
 */

const readline = require("readline");

function validate(name, score) {
  const trimmed = name.trim();

  // TODO: Rule 1 — name must not be empty after trim → "ERROR: name is required"

  // Rule 2 (intentionally disabled for this exercise): score must be 0–100
  // Leave the score-range check commented out so score 200 can still be OK.

  // TODO: Rule 3 — name must be at least 2 chars after trim → "ERROR: name too short"

  // TODO: return "OK" when all active rules pass
  throw new Error("Not implemented");
}

async function main() {
  const lines = [];
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    lines.push(line);
    if (lines.length < 2) continue;
    const name = lines[0];
    const score = Number(lines[1].trim());
    process.stdout.write(validate(name, score) + "\n");
    rl.close();
    return;
  }
  rl.close();
}

main();
