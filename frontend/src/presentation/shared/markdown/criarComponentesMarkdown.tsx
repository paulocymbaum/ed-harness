import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { MarkdownBlocoCodigo } from "./MarkdownBlocoCodigo";
import { MarkdownCallout } from "./MarkdownCallout";
import { MarkdownCitacao } from "./MarkdownCitacao";
import { classificarBlocoCodigo } from "./preprocess/classificarBlocoCodigo";
import { extrairCalloutDeBlockquote } from "./preprocess/extrairCalloutDeBlockquote";

export type MarkdownDensidade = "leitura" | "compacta";

export type CriarComponentesMarkdownOpcoes = {
  densidade?: MarkdownDensidade;
  habilitarCopiarCodigo?: boolean;
};

export function criarComponentesMarkdown(
  opcoes: CriarComponentesMarkdownOpcoes = {},
): Components {
  const compacta = opcoes.densidade === "compacta";
  const h2Mt = compacta ? "mt-4" : "mt-7";
  const h3Mt = compacta ? "mt-3" : "mt-5";
  const pMb = compacta ? "mb-2" : "mb-3";

  return {
    h1: ({ children }) => (
      <h1 className="m-0 mb-3 text-section font-semibold tracking-[-0.01em] text-text0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={`m-0 mb-2 ${h2Mt} border-b border-border0/60 pb-2 text-body-lg font-semibold text-text0`}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`m-0 mb-2 ${h3Mt} text-body font-semibold text-text0`}>{children}</h3>
    ),
    p: ({ children }) => <p className={`m-0 ${pMb} text-text0`}>{children}</p>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-accent1 underline decoration-border0 underline-offset-4 hover:brightness-110"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className={`m-0 ${pMb} list-disc space-y-1 pl-5 marker:text-accent0`}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={`m-0 ${pMb} list-decimal space-y-1 pl-5 marker:text-accent0`}>{children}</ol>
    ),
    li: ({ children, ...props }) => {
      const checked = (props as { checked?: boolean }).checked;
      if (typeof checked === "boolean") {
        return (
          <li className="mb-1 flex list-none items-start gap-2">
            <input
              type="checkbox"
              checked={checked}
              readOnly
              disabled
              className="mt-1 accent-[var(--accent-0)]"
              aria-hidden
            />
            <span>{children}</span>
          </li>
        );
      }
      return <li className="mb-1">{children}</li>;
    },
    blockquote: ({ children }) => {
      const { tipo, conteudo } = extrairCalloutDeBlockquote(children);
      if (tipo) {
        return <MarkdownCallout tipo={tipo}>{conteudo}</MarkdownCallout>;
      }
      return <MarkdownCitacao>{conteudo}</MarkdownCitacao>;
    },
    hr: () => <hr className="my-5 border-0 border-t border-border0" />,
    code: ({ className, children, ...props }) => {
      const { isBlock, language } = classificarBlocoCodigo(className);
      if (isBlock) {
        return (
          <MarkdownBlocoCodigo
            language={language}
            habilitarCopiar={opcoes.habilitarCopiarCodigo !== false}
          >
            {children}
          </MarkdownBlocoCodigo>
        );
      }
      return (
        <code
          className="rounded-panel border border-border0 bg-surfaceControl px-1.5 py-0.5 font-mono text-meta text-accent1"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => {
      // Fenced blocks: react-markdown wraps <code> in <pre>. Our code override
      // already returns MarkdownBlocoCodigo for language-* fences — unwrap pre.
      return <>{children as ReactNode}</>;
    },
    table: ({ children }) => (
      <div className={`overflow-auto rounded-panel border border-border0 ${pMb}`}>
        <table className="w-full border-collapse text-meta">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-surfaceControl text-meta text-text0">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="border-b border-border0 px-3 py-2.5 text-left font-semibold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border-b border-border0 px-3 py-2.5 align-top text-text0">{children}</td>
    ),
  };
}
