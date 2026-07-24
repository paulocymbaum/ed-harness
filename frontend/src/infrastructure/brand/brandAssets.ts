import type { AppTheme } from "../../domain/types/theme";

/**
 * Series 1 = light mark (for dark UI); series 2 = navy mark (for light UI).
 * Source of truth: repo `assets/logo/` (copied into `frontend/public/logo/`).
 */
export function brandMarkSrc(theme: AppTheme, size: 32 | 64 | 128 = 64): string {
  const series = theme === "dark" ? 1 : 2;
  return `/logo/${series}-sem-fundo-${size}.png`;
}

type FaviconSlot = {
  id: string;
  series: 1 | 2;
  rel: "icon" | "apple-touch-icon";
  href: string;
  type?: string;
  sizes?: string;
};

const FAVICON_SLOTS: FaviconSlot[] = [
  {
    id: "praxis-favicon-ico-dark",
    series: 1,
    rel: "icon",
    href: "/logo/1-favicon.ico",
    sizes: "any",
  },
  {
    id: "praxis-favicon-ico-light",
    series: 2,
    rel: "icon",
    href: "/logo/2-favicon.ico",
    sizes: "any",
  },
  {
    id: "praxis-favicon-png-dark",
    series: 1,
    rel: "icon",
    type: "image/png",
    href: "/logo/1-favicon-32.png",
    sizes: "32x32",
  },
  {
    id: "praxis-favicon-png-light",
    series: 2,
    rel: "icon",
    type: "image/png",
    href: "/logo/2-favicon-32.png",
    sizes: "32x32",
  },
  {
    id: "praxis-apple-touch-icon-dark",
    series: 1,
    rel: "apple-touch-icon",
    href: "/logo/1-favicon-180.png",
  },
  {
    id: "praxis-apple-touch-icon-light",
    series: 2,
    rel: "apple-touch-icon",
    href: "/logo/2-favicon-180.png",
  },
];

function mediaForSeries(series: 1 | 2, theme: AppTheme | null): string {
  if (theme === "dark") return series === 1 ? "all" : "not all";
  if (theme === "light") return series === 2 ? "all" : "not all";
  // No explicit app theme yet: follow the browser/OS appearance.
  return series === 1 ? "(prefers-color-scheme: dark)" : "(prefers-color-scheme: light)";
}

function upsertLink(slot: FaviconSlot, media: string): void {
  let el = document.getElementById(slot.id) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.id = slot.id;
    document.head.appendChild(el);
  }
  el.setAttribute("rel", slot.rel);
  el.setAttribute("href", slot.href);
  if (slot.type) el.setAttribute("type", slot.type);
  else el.removeAttribute("type");
  if (slot.sizes) el.setAttribute("sizes", slot.sizes);
  else el.removeAttribute("sizes");
  el.setAttribute("media", media);
}

/**
 * Install dark/light favicon pairs.
 * - With an app theme: force that series (`media=all` / `not all`).
 * - Without: use `prefers-color-scheme` so the browser chrome follows OS appearance.
 */
export function applyBrandIconsToDocument(theme: AppTheme | null): void {
  // Drop legacy single-slot ids from older builds.
  for (const legacyId of ["praxis-favicon-ico", "praxis-favicon-png", "praxis-apple-touch-icon"]) {
    document.getElementById(legacyId)?.remove();
  }

  for (const slot of FAVICON_SLOTS) {
    upsertLink(slot, mediaForSeries(slot.series, theme));
  }
}
