import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { Button, Icon } from "../../design-system";
import { copyToClipboard } from "../utils/copyToClipboard";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

export function MarkdownBlocoCodigo(props: {
  language: string | null;
  children: ReactNode;
  habilitarCopiar?: boolean;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const codeText = extractText(props.children);

  const handleCopy = async () => {
    setCopyError(false);
    const ok = await copyToClipboard(codeText);
    if (!ok) {
      setCopyError(true);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4 overflow-hidden rounded-panel border border-border0 bg-surfaceControl shadow-glass1">
      <div className="flex items-center justify-between gap-2 border-b border-border0 bg-surfacePanel/80 px-3 py-2">
        <span className="font-mono text-meta font-medium uppercase tracking-wide text-text1">
          {props.language ?? "code"}
        </span>
        {props.habilitarCopiar !== false ? (
          <div className="relative">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-iconDefault"
              onClick={() => void handleCopy()}
              aria-label={copied ? t("markdown.copied") : t("markdown.copy")}
              title={copied ? t("markdown.copied") : t("markdown.copy")}
            >
              <Icon icon={copied ? Check : Copy} size={14} />
              <span className="text-meta">{copied ? t("markdown.copied") : t("markdown.copy")}</span>
            </Button>
            {copyError ? (
              <span className="absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-panel border border-dangerBorder bg-dangerFill px-2 py-1 text-meta text-dangerText">
                {t("markdown.copyFailed")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <pre className="m-0 overflow-auto p-4 text-meta leading-relaxed text-text0">
        <code className="font-mono text-meta leading-relaxed text-text0">{props.children}</code>
      </pre>
    </div>
  );
}
