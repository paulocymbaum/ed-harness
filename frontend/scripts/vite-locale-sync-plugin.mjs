import { promises as fs } from "node:fs";
import path from "node:path";

const SUPPORTED = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  zh: "Chinese",
};

/**
 * Dev-only Vite plugin: syncs the app locale picker to `.cursor/language.json`
 * so Cursor hooks/tools follow the platform language selection.
 */
export function localeSyncPlugin(repoRoot) {
  const languagePath = path.join(repoRoot, ".cursor", "language.json");

  return {
    name: "locale-sync",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/locale")) return next();

        if (req.method === "GET") {
          try {
            const raw = await fs.readFile(languagePath, "utf8");
            res.setHeader("Content-Type", "application/json");
            res.end(raw);
          } catch (err) {
            if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
              res.statusCode = 404;
              res.end("Not found");
              return;
            }
            res.statusCode = 500;
            res.end("Failed to read language.json");
          }
          return;
        }

        if (req.method === "POST") {
          try {
            const body = await readJsonBody(req);
            const code = normalizeLocale(body?.locale ?? body?.language);
            if (!code) {
              res.statusCode = 400;
              res.end("Invalid locale");
              return;
            }

            const existing = await readExistingLanguage(languagePath);
            if (existing && normalizeLocale(existing.language ?? existing.locale) === code) {
              // Same language — leave the file untouched (no updatedAt churn).
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(existing));
              return;
            }

            const payload = {
              language: code,
              label: SUPPORTED[code],
              source: "platform",
              updatedAt: new Date().toISOString(),
            };

            await fs.mkdir(path.dirname(languagePath), { recursive: true });
            await fs.writeFile(languagePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
          } catch {
            res.statusCode = 500;
            res.end("Failed to write language.json");
          }
          return;
        }

        res.statusCode = 405;
        res.end("Method not allowed");
      });
    },
  };
}

function normalizeLocale(raw) {
  if (typeof raw !== "string") return null;
  const code = raw.trim().toLowerCase().split(/[-_]/)[0];
  return code in SUPPORTED ? code : null;
}

async function readExistingLanguage(languagePath) {
  try {
    const raw = await fs.readFile(languagePath, "utf8");
    const data = JSON.parse(raw);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}
