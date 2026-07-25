/** Remove HTML comments used as Cursor/editor markers from markdown bodies. */
export function stripCursorComments(input: string): string {
  return input
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t.startsWith("<!--") || !t.endsWith("-->")) return true;
      return !(t.includes("cursor:") || t.includes("marker:"));
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
