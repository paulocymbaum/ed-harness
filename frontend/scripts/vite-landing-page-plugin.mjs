import fs from "node:fs";
import path from "node:path";

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
    return "text/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".md")) return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

function resolveLandingRoot(repoRoot) {
  const candidates = [
    path.resolve(repoRoot, "landing_page"),
    path.resolve(repoRoot, "../landing_page"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "index.html"))) return dir;
  }
  return candidates[0];
}

/**
 * Dev-only: serves nested or sibling `landing_page/` at `/landing/` so the promo
 * page and the React study UI share one Vite origin (CTA → `/?tour=1&lang=…`).
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
  };
}
