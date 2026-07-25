import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "../../../application/hooks/useTranslation";
import {
  criarComponentesMarkdown,
  type MarkdownDensidade,
} from "./criarComponentesMarkdown";
import { MarkdownGraphIndexMeta } from "./MarkdownGraphIndexMeta";
import { prepararMarkdownParaExibicao } from "./preprocess";

export function MarkdownView(props: {
  markdown: string;
  /** Used to strip a leading `# Title` that duplicates the page chrome. */
  title?: string;
  densidade?: MarkdownDensidade;
  habilitarCopiarCodigo?: boolean;
  mostrarGraphIndex?: boolean;
}) {
  const { t } = useTranslation();
  const { markdown, graphIndex } = prepararMarkdownParaExibicao(props.markdown, {
    stripDuplicateTitle: props.title,
  });

  if (!markdown) {
    return <p className="m-0 text-meta text-text1">{t("markdown.empty")}</p>;
  }

  return (
    <div className="text-body leading-relaxed text-text0">
      {props.mostrarGraphIndex !== false && graphIndex ? (
        <MarkdownGraphIndexMeta graphIndex={graphIndex} />
      ) : null}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={criarComponentesMarkdown({
          densidade: props.densidade,
          habilitarCopiarCodigo: props.habilitarCopiarCodigo,
        })}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
