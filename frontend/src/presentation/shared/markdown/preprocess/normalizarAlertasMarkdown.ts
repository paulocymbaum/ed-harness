export type MarkdownCalloutTipo =
  | "tip"
  | "note"
  | "important"
  | "warning"
  | "caution";

const ALERT_TYPES = new Set<MarkdownCalloutTipo>([
  "tip",
  "note",
  "important",
  "warning",
  "caution",
]);

/**
 * Normalizes GitHub-style alert blockquotes into a bold marker that survives
 * react-markdown without rehype-raw:
 * `> [!TIP]` → `> **callout:tip**`
 */
export function normalizarAlertasMarkdown(input: string): string {
  return input.replace(
    /^([ \t]*>[ \t]*)\[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\][ \t]*$/gim,
    (_match, prefix: string, tipoRaw: string) => {
      const tipo = tipoRaw.toLowerCase() as MarkdownCalloutTipo;
      if (!ALERT_TYPES.has(tipo)) return _match;
      return `${prefix}**callout:${tipo}**`;
    },
  );
}

export function parseCalloutMarkerText(text: string): MarkdownCalloutTipo | null {
  const match = text.trim().match(/^callout:(tip|note|important|warning|caution)$/i);
  if (!match?.[1]) return null;
  return match[1].toLowerCase() as MarkdownCalloutTipo;
}
