import type { AppLocale } from "../../domain/types/locale";

const API_PATH = "/api/locale";

/**
 * Persist the platform language selection to `.cursor/language.json` (via Vite
 * dev middleware) so Cursor hooks/tools match the app locale picker.
 * No-ops outside the Vite dev server.
 */
export async function syncLocaleToCursorConfig(locale: AppLocale): Promise<void> {
  try {
    await fetch(API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
  } catch {
    // Dev server may be unavailable; Cursor tools keep the last synced file.
  }
}
