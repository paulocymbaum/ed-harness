import { useState } from "react";
import { ClipboardCheck, Lightbulb } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon } from "../../../design-system";
import { copyToClipboard } from "../../../shared/utils/copyToClipboard";
import {
  buildReviewCursorPrompt,
  buildSocraticCursorPrompt,
  type DeliveryPromptContext,
} from "./deliveryPrompts";
import { PROJECT_DELIVERY_PASS_SCORE } from "../../../../domain/types/projectDelivery";

type PromptKind = "review" | "socratic";

function DeliveryPromptButton(props: {
  kind: PromptKind;
  context: DeliveryPromptContext;
}) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const config =
    props.kind === "review"
      ? {
          icon: ClipboardCheck,
          label: t("reader.projectCorrection"),
          tooltip: t("delivery.correctionTooltip", { threshold: PROJECT_DELIVERY_PASS_SCORE }),
          build: buildReviewCursorPrompt,
        }
      : {
          icon: Lightbulb,
          label: t("reader.contextualExplanation"),
          tooltip: t("delivery.explanationTooltip"),
          build: buildSocraticCursorPrompt,
        };

  const handleCopy = async () => {
    setCopyError(false);
    const ok = await copyToClipboard(config.build(props.context));
    if (!ok) {
      setCopyError(true);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        title={config.tooltip}
        aria-label={config.label}
        onClick={() => void handleCopy()}
        className="gap-2"
      >
        <Icon icon={config.icon} size={16} />
        <span className="hidden sm:inline">{config.label}</span>
      </Button>
      {copied ? (
        <span className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded-panel border border-successBorder bg-successFill px-2 py-1 text-meta text-successText">
          {t("delivery.promptCopied")}
        </span>
      ) : null}
      {copyError ? (
        <span className="absolute left-0 top-full z-10 mt-1 max-w-[14rem] rounded-panel border border-dangerBorder bg-dangerFill px-2 py-1 text-meta text-dangerText">
          {t("delivery.promptCopyFailed")}
        </span>
      ) : null}
    </div>
  );
}

export function DeliveryPromptToolbar(props: DeliveryPromptContext) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-meta text-text1">{t("delivery.promptsHeading")}</span>
      <DeliveryPromptButton kind="socratic" context={props} />
      <DeliveryPromptButton kind="review" context={props} />
    </div>
  );
}
