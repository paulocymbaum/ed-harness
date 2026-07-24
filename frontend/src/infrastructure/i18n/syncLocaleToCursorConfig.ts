import type { AppLocale } from "../../domain/types/locale";

const API_PATH = "/api/locale";

/**
 * Persist a newly selected platform language to `.cursor/language.json` (via
 * Vite dev middleware) so Cursor hooks/tools match the app locale picker.
 * Call only when the locale actually changes — not on mount/rehydration.
 * No-ops outside the Vite dev server. The API also skips writes when unchanged.
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
