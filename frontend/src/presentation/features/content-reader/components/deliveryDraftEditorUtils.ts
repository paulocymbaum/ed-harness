/** Leading spaces/tabs of a single line (no newlines). */
export function leadingIndent(line: string): string {
  const match = line.match(/^[ \t]*/);
  return match?.[0] ?? "";
}

/**
 * Inserts a newline that preserves the indentation of the current line.
 * Returns the next value and caret position after the inserted indent.
 */
export function insertNewlineWithIndent(
  value: string,
  selectionStart: number,
  selectionEnd: number = selectionStart,
): { value: string; caret: number } {
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  const lineStart = before.lastIndexOf("\n") + 1;
  const currentLine = before.slice(lineStart);
  const indent = leadingIndent(currentLine);
  return {
    value: `${before}\n${indent}${after}`,
    caret: selectionStart + 1 + indent.length,
  };
}

export function countLines(value: string): number {
  if (!value) return 1;
  let count = 1;
  for (let i = 0; i < value.length; i += 1) {
    if (value.charCodeAt(i) === 10) count += 1;
  }
  return count;
}
