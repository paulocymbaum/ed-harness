import { stripDuplicateReadmeTitle } from "../../readmeUtils";
import { extrairMetaGraphIndex } from "./extrairMetaGraphIndex";
import { normalizarAlertasMarkdown } from "./normalizarAlertasMarkdown";
import { stripCursorComments } from "./stripCursorComments";

export type PrepararMarkdownOpcoes = {
  stripCursorComments?: boolean;
  stripDuplicateTitle?: string;
  normalizarQuebras?: boolean;
  extrairGraphIndex?: boolean;
};

export type MarkdownPreparado = {
  markdown: string;
  graphIndex?: string;
};

export function prepararMarkdownParaExibicao(
  input: string,
  opcoes: PrepararMarkdownOpcoes = {},
): MarkdownPreparado {
  const {
    stripCursorComments: shouldStripComments = true,
    stripDuplicateTitle,
    normalizarQuebras = true,
    extrairGraphIndex = true,
  } = opcoes;

  let markdown = input ?? "";

  if (shouldStripComments) {
    markdown = stripCursorComments(markdown);
  }

  if (stripDuplicateTitle) {
    markdown = stripDuplicateReadmeTitle(markdown, stripDuplicateTitle);
  }

  markdown = normalizarAlertasMarkdown(markdown);

  let graphIndex: string | undefined;
  if (extrairGraphIndex) {
    const extracted = extrairMetaGraphIndex(markdown);
    markdown = extracted.markdownSemMeta;
    graphIndex = extracted.graphIndex;
  }

  if (normalizarQuebras) {
    markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();
  }

  return { markdown, graphIndex };
}
