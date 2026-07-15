import fs from "node:fs";
import path from "node:path";

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
    return "application/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

const SKIP_DIR_NAMES = new Set([
  ".git",
  ".github",
  ".vercel",
  "node_modules",
  "scripts",
]);

const SKIP_FILE_NAMES = new Set([
  ".env",
  ".gitignore",
  "package.json",
  "vercel.json",
  "README.md",
  "LANDINGPAGE_STYLE.md",
  "LANDINGPAGE_WIREFRAME.md",
]);

/**
 * Resolve promo landing root: nested `landing_page/` (CI) or sibling `../landing_page` (local).
 */
export function resolveLandingRoot(repoRoot) {
  const candidates = [
    path.resolve(repoRoot, "landing_page"),
    path.resolve(repoRoot, "../landing_page"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) return dir;
  }
  return candidates[0];
}

function copyLandingTree(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith(".env")) continue;
    if (SKIP_DIR_NAMES.has(entry.name) || SKIP_FILE_NAMES.has(entry.name)) continue;
    if (entry.name.endsWith(".example.js") || entry.name.endsWith(".example")) continue;

    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyLandingTree(from, to);
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name === "config.js") {
      // Prefer generated config; fall back to example if missing
      fs.copyFileSync(from, to);
      continue;
    }
    if (entry.name === "config.example.js") continue;
    fs.copyFileSync(from, to);
  }
}

function ensureConfigJs(landingRoot) {
  const configPath = path.join(landingRoot, "js", "config.js");
  if (fs.existsSync(configPath)) return;
  const example = path.join(landingRoot, "js", "config.example.js");
  if (fs.existsSync(example)) {
    fs.copyFileSync(example, configPath);
  }
}

/**
 * Serves sibling/nested `landing_page/` at `/landing/` in dev, and copies it into
 * `dist/landing/` on build so production (Vercel) keeps the same origin + guided tour CTA.
 */
export function landingPagePlugin(repoRoot) {
  const landingRoot = resolveLandingRoot(repoRoot);

  return {
    name: "landing-page",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url ?? "";
        const pathname = rawUrl.split("?")[0] ?? "";

        if (pathname === "/landing") {
          res.statusCode = 302;
          res.setHeader("Location", "/landing/");
          res.end();
          return;
        }

        if (!pathname.startsWith("/landing/")) return next();

        let rel = pathname.slice("/landing/".length);
        if (!rel || rel.endsWith("/")) rel = `${rel}index.html`;

        const normalized = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
        const filePath = path.resolve(landingRoot, normalized);
        if (!filePath.startsWith(landingRoot + path.sep) && filePath !== landingRoot) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        fs.readFile(filePath, (err, data) => {
          if (err) {
            next();
            return;
          }
          res.setHeader("Content-Type", contentType(filePath));
          res.end(data);
        });
      });
    },
    closeBundle() {
      if (!fs.existsSync(path.join(landingRoot, "index.html"))) {
        console.warn(
          `[landing-page] skipped: no index.html at ${landingRoot} (clone sibling ../landing_page or set CI copy)`,
        );
        return;
      }
      ensureConfigJs(landingRoot);
      const outDir = path.resolve(repoRoot, "frontend", "dist", "landing");
      copyLandingTree(landingRoot, outDir);
      console.log(`[landing-page] copied → ${outDir}`);
    },
  };
}
