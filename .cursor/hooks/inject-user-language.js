#!/usr/bin/env node
/**
 * Cursor hook: inject / refresh the user's preferred response language.
 *
 * - sessionStart: set session env + additional_context from current preference
 * - postToolUse: if language.json or --set was changed, refresh env + context
 *
 * Fail-open: any error yields {} so sessions/tools are never blocked.
 */
const fs = require("fs");
const path = require("path");
const {
  resolveLanguage,
  buildPromptBlock,
  configPath,
} = require("../tools/get-user-language.js");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parsePayload(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function languageConfigTouched(payload) {
  const event = payload.hook_event_name || "";
  const toolName = payload.tool_name || "";
  const cfgAbs = path.resolve(configPath());
  const cfgNorm = cfgAbs.replace(/\\/g, "/");

  if (event === "sessionStart" || !event) {
    // sessionStart always injects; bare stdin {} also injects (manual tests).
    return true;
  }

  if (event === "afterFileEdit") {
    const filePath = String(payload.file_path || "").replace(/\\/g, "/");
    return filePath === cfgNorm || filePath.endsWith("/.cursor/language.json");
  }

  if (event === "postToolUse" || toolName) {
    if (toolName === "Write" || toolName === "TabWrite") {
      const input = payload.tool_input || {};
      const filePath = String(input.path || input.file_path || input.filePath || "")
        .replace(/\\/g, "/");
      return (
        filePath === cfgNorm ||
        filePath.endsWith("/.cursor/language.json") ||
        filePath === ".cursor/language.json"
      );
    }

    if (toolName === "Shell") {
      const command = String((payload.tool_input && payload.tool_input.command) || "");
      return (
        command.includes("get-user-language.js --set") ||
        command.includes("language.json")
      );
    }
  }

  return false;
}

function buildOutput(resolved) {
  return {
    env: {
      CURSOR_RESPONSE_LANGUAGE: resolved.language,
    },
    additional_context: buildPromptBlock(resolved),
  };
}

function main() {
  try {
    const payload = parsePayload(readStdin());
    if (!languageConfigTouched(payload)) {
      process.stdout.write("{}\n");
      return;
    }

    // Always re-read language.json so CURSOR_RESPONSE_LANGUAGE tracks edits.
    const resolved = resolveLanguage();
    process.env.CURSOR_RESPONSE_LANGUAGE = resolved.language;
    process.stdout.write(`${JSON.stringify(buildOutput(resolved))}\n`);
  } catch {
    process.stdout.write("{}\n");
  }
}

main();
