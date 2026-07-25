import { describe, expect, it } from "vitest";
import { classificarBlocoCodigo } from "./classificarBlocoCodigo";
import { extrairMetaGraphIndex } from "./extrairMetaGraphIndex";
import { normalizarAlertasMarkdown, parseCalloutMarkerText } from "./normalizarAlertasMarkdown";
import { prepararMarkdownParaExibicao } from "./prepararMarkdownParaExibicao";
import { stripCursorComments } from "./stripCursorComments";

describe("stripCursorComments", () => {
  it("removes cursor/marker HTML comments and collapses blank lines", () => {
    const input = "Hello\n\n\n<!-- cursor:x -->\n\nWorld\n<!-- marker:y -->";
    expect(stripCursorComments(input)).toBe("Hello\n\nWorld");
  });

  it("keeps unrelated HTML comments", () => {
    expect(stripCursorComments("A\n<!-- note -->\nB")).toBe("A\n<!-- note -->\nB");
  });
});

describe("normalizarAlertasMarkdown", () => {
  it("rewrites GitHub alert markers", () => {
    const input = "> [!TIP]\n> Drink water";
    expect(normalizarAlertasMarkdown(input)).toBe("> **callout:tip**\n> Drink water");
  });

  it("parses callout marker text", () => {
    expect(parseCalloutMarkerText("callout:warning")).toBe("warning");
    expect(parseCalloutMarkerText("plain")).toBeNull();
  });
});

describe("extrairMetaGraphIndex", () => {
  it("extracts graph index meta and removes the line", () => {
    const input = "> Graph index: `07.1`\n\n# Title\n\nBody";
    expect(extrairMetaGraphIndex(input)).toEqual({
      markdownSemMeta: "# Title\n\nBody",
      graphIndex: "07.1",
    });
  });
});

describe("classificarBlocoCodigo", () => {
  it("detects fenced language classes", () => {
    expect(classificarBlocoCodigo("language-js")).toEqual({
      isBlock: true,
      language: "js",
    });
    expect(classificarBlocoCodigo(undefined)).toEqual({
      isBlock: false,
      language: null,
    });
  });
});

describe("prepararMarkdownParaExibicao", () => {
  it("runs the full preprocess pipeline", () => {
    const input = [
      "# Title",
      "",
      "> Graph index: `01.2`",
      "",
      "<!-- cursor:skip -->",
      "",
      "> [!NOTE]",
      "> Remember this",
      "",
      "",
      "Done",
    ].join("\n");

    const result = prepararMarkdownParaExibicao(input, {
      stripDuplicateTitle: "Title",
    });

    expect(result.graphIndex).toBe("01.2");
    expect(result.markdown).toContain("**callout:note**");
    expect(result.markdown).not.toContain("Graph index");
    expect(result.markdown).not.toContain("cursor:skip");
    expect(result.markdown.startsWith("#")).toBe(false);
  });
});
