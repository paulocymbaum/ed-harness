const GRAPH_INDEX_LINE =
  /^[ \t]*>[ \t]*Graph index:[ \t]*`?([^`\n]+)`?[ \t]*$/gim;

export function extrairMetaGraphIndex(input: string): {
  markdownSemMeta: string;
  graphIndex?: string;
} {
  let graphIndex: string | undefined;
  const markdownSemMeta = input
    .replace(GRAPH_INDEX_LINE, (_match, index: string) => {
      if (!graphIndex) graphIndex = index.trim();
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { markdownSemMeta, graphIndex };
}
