import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { quizScorePlugin } from "./scripts/vite-quiz-score-plugin.mjs";
import { projectDeliveryPlugin } from "./scripts/vite-project-delivery-plugin.mjs";
import { projectRunPlugin } from "./scripts/vite-project-run-plugin.mjs";
import { localeSyncPlugin } from "./scripts/vite-locale-sync-plugin.mjs";
import { landingPagePlugin } from "./scripts/vite-landing-page-plugin.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
  plugins: [
    react(),
    landingPagePlugin(repoRoot),
    quizScorePlugin(repoRoot),
    projectDeliveryPlugin(repoRoot),
    projectRunPlugin(repoRoot),
    localeSyncPlugin(repoRoot),
  ],
  server: {
    port: 5173,
    open: "/landing/",
  },
});
