#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SUPPORTED = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  zh: "Chinese",
};

const DEFAULT_LANGUAGE = "en";
const CONFIG_REL = path.join(".cursor", "language.json");

function projectRoot() {
  return path.resolve(__dirname, "../..");
}

function configPath() {
  return path.join(projectRoot(), CONFIG_REL);
}

function normalizeLanguage(raw) {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toLowerCase().split(/[-_]/)[0];
  if (!code || !(code in SUPPORTED)) return null;
  return code;
}

function readConfigLanguage() {
  try {
    const data = JSON.parse(fs.readFileSync(configPath(), "utf8"));
    const code = normalizeLanguage(data.language ?? data.locale);
    if (!code) return null;
    const label =
      typeof data.label === "string" && data.label.trim()
        ? data.label.trim()
        : SUPPORTED[code];
    return { language: code, label, source: "config" };
  } catch {
    return null;
  }
}

/**
 * Source of truth: `.cursor/language.json` when present.
 * That file is written by the study app locale picker (Vite `/api/locale`) and
 * by `get-user-language.js --set`. Env only applies when the config is missing.
 */
function resolveLanguage() {
  const fromConfig = readConfigLanguage();
  if (fromConfig) return fromConfig;

  const fromEnv =
    normalizeLanguage(process.env.CURSOR_RESPONSE_LANGUAGE) ||
    normalizeLanguage(process.env.HACKERRANK_STUDY_LANGUAGE);
  if (fromEnv) {
    return {
      language: fromEnv,
      label: SUPPORTED[fromEnv],
      source: "env",
    };
  }

  return {
    language: DEFAULT_LANGUAGE,
    label: SUPPORTED[DEFAULT_LANGUAGE],
    source: "default",
  };
}

function writeLanguageConfig(code) {
  const language = normalizeLanguage(code);
  if (!language) {
    throw new Error(
      `Unsupported language: ${JSON.stringify(code)}. Use one of: ${Object.keys(SUPPORTED).join(", ")}`,
    );
  }

  const payload = {
    language,
    label: SUPPORTED[language],
  };
  const target = configPath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  // Keep process env in sync for the current Node process / child shells started after set.
  process.env.CURSOR_RESPONSE_LANGUAGE = language;

  return {
    language,
    label: payload.label,
    source: "config",
    env: { CURSOR_RESPONSE_LANGUAGE: language },
    path: target,
  };
}

function buildPromptBlock(resolved) {
  return [
    "## User language preference",
    "",
    `Respond to the user in ${resolved.label} (language code: ${resolved.language}).`,
    "Keep code, identifiers, file paths, and shell commands unchanged.",
    "Course graph labels and API/tool identifiers stay in their source language when they are proper nouns or machine-facing strings.",
    `Effective preference source: ${resolved.source}. Config file: ${CONFIG_REL}.`,
  ].join("\n");
}

function usage() {
  return [
    "Usage:",
    "  node .cursor/tools/get-user-language.js [--json|--prompt]",
    "  node .cursor/tools/get-user-language.js --set <en|pt|es|zh>",
    "",
    "Resolution: .cursor/language.json (synced from platform locale) → env → en",
    "Use --set to update language.json manually; the app language picker also updates it via /api/locale.",
  ].join("\n");
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const setIdx = args.indexOf("--set");
  if (setIdx !== -1) {
    const code = args[setIdx + 1];
    if (!code) {
      process.stderr.write("Missing language code after --set.\n");
      process.stderr.write(`${usage()}\n`);
      process.exit(2);
    }
    try {
      const written = writeLanguageConfig(code);
      process.stdout.write(`${JSON.stringify(written, null, 2)}\n`);
    } catch (err) {
      process.stderr.write(`${err.message}\n`);
      process.exit(2);
    }
    return;
  }

  const resolved = resolveLanguage();
  const wantPrompt = args.includes("--prompt");
  const wantJson = args.includes("--json");

  if (wantPrompt && wantJson) {
    process.stderr.write("Use either --json or --prompt, not both.\n");
    process.exit(2);
  }

  if (wantPrompt) {
    process.stdout.write(`${buildPromptBlock(resolved)}\n`);
    return;
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ...resolved,
        env: { CURSOR_RESPONSE_LANGUAGE: resolved.language },
      },
      null,
      2,
    )}\n`,
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  resolveLanguage,
  buildPromptBlock,
  writeLanguageConfig,
  configPath,
  SUPPORTED,
  CONFIG_REL,
};
