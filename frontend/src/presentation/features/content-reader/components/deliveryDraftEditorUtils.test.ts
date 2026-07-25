import { describe, expect, it } from "vitest";
import {
  countLines,
  insertNewlineWithIndent,
  leadingIndent,
} from "./deliveryDraftEditorUtils";

describe("leadingIndent", () => {
  it("captures spaces and tabs", () => {
    expect(leadingIndent("    const x = 1")).toBe("    ");
    expect(leadingIndent("\t\tfoo")).toBe("\t\t");
    expect(leadingIndent("no indent")).toBe("");
  });
});

describe("insertNewlineWithIndent", () => {
  it("continues the current line indent after Enter", () => {
    const value = "function main() {\n  const x = 1;";
    const caret = value.length;
    expect(insertNewlineWithIndent(value, caret)).toEqual({
      value: "function main() {\n  const x = 1;\n  ",
      caret: caret + 1 + 2,
    });
  });

  it("works at the start of an indented line", () => {
    const value = "  hello";
    expect(insertNewlineWithIndent(value, 2)).toEqual({
      value: "  \n  hello",
      caret: 5,
    });
  });

  it("replaces a selection when Enter is pressed", () => {
    expect(insertNewlineWithIndent("  abcd", 3, 5)).toEqual({
      value: "  a\n  d",
      caret: 6,
    });
  });
});

describe("countLines", () => {
  it("counts newline-separated lines", () => {
    expect(countLines("")).toBe(1);
    expect(countLines("a")).toBe(1);
    expect(countLines("a\nb\n")).toBe(3);
  });
});
