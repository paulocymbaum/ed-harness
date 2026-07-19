/**
 * Extract a YouTube video id from watch, embed, shorts, or youtu.be URLs.
 * Returns null when the URL is not a recognizable YouTube video link.
 */
export function extractYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return isYoutubeVideoId(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery && isYoutubeVideoId(fromQuery)) return fromQuery;

      const segments = parsed.pathname.split("/").filter(Boolean);
      const kind = segments[0];
      const candidate = segments[1];
      if (
        candidate &&
        (kind === "embed" || kind === "shorts" || kind === "live" || kind === "v") &&
        isYoutubeVideoId(candidate)
      ) {
        return candidate;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}

function isYoutubeVideoId(value: string): boolean {
  return /^[\w-]{11}$/.test(value);
}
