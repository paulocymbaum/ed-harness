import type { ReactNode } from "react";
import {
  AlertTriangle,
  Info,
  Lightbulb,
  OctagonAlert,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import type { TranslationKey } from "../../../infrastructure/i18n/locales/en";
import { Icon } from "../../design-system";
import type { MarkdownCalloutTipo } from "./preprocess/normalizarAlertasMarkdown";

const CALLOUT_CONFIG: Record<
  MarkdownCalloutTipo,
  { icon: LucideIcon; labelKey: TranslationKey; tone: "accent" | "danger" | "warning" }
> = {
  tip: { icon: Lightbulb, labelKey: "markdown.callout.tip", tone: "accent" },
  note: { icon: Info, labelKey: "markdown.callout.note", tone: "accent" },
  important: { icon: ShieldAlert, labelKey: "markdown.callout.important", tone: "accent" },
  warning: { icon: AlertTriangle, labelKey: "markdown.callout.warning", tone: "warning" },
  caution: { icon: OctagonAlert, labelKey: "markdown.callout.caution", tone: "danger" },
};

export function MarkdownCallout(props: {
  tipo: MarkdownCalloutTipo;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const config = CALLOUT_CONFIG[props.tipo];

  const shell =
    config.tone === "danger"
      ? "border-dangerBorder border-l-dangerIcon bg-dangerFill"
      : config.tone === "warning"
        ? "border-dangerBorder/60 border-l-dangerIcon bg-dangerFill/70"
        : "border-accent0/35 border-l-accent0 bg-surfaceAccent/15";

  const iconTone =
    config.tone === "danger" || config.tone === "warning"
      ? "text-dangerIcon"
      : "text-accent0";

  return (
    <aside
      className={`mb-4 overflow-hidden rounded-panel border border-l-[3px] ${shell} p-3`}
      data-callout={props.tipo}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon icon={config.icon} size={16} className={iconTone} />
        <span className="text-meta font-semibold uppercase tracking-wide text-text0">
          {t(config.labelKey)}
        </span>
      </div>
      <div className="text-body text-text0 [&>*:last-child]:mb-0">{props.children}</div>
    </aside>
  );
}
