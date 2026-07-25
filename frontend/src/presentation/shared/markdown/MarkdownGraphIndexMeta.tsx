import { useTranslation } from "../../../application/hooks/useTranslation";

export function MarkdownGraphIndexMeta(props: { graphIndex: string }) {
  const { t } = useTranslation();

  return (
    <p className="mb-4 mt-0 flex flex-wrap items-center gap-2 text-meta text-text1">
      <span className="font-medium uppercase tracking-wide text-text1">
        {t("markdown.graphIndex")}
      </span>
      <code className="rounded-panel border border-border0 bg-surfaceControl px-1.5 py-0.5 font-mono text-meta text-accent0">
        {props.graphIndex}
      </code>
    </p>
  );
}
