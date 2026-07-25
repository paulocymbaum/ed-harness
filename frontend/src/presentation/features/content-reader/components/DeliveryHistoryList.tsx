import { useTranslation } from "../../../../application/hooks/useTranslation";
import type { ProjectDeliveryEntry, ProjectDeliveryReview } from "../../../../domain/types/projectDelivery";
import { PROJECT_DELIVERY_PASS_SCORE, passesDeliveryReview } from "../../../../domain/types/projectDelivery";
import { formatDeliveryMarkdownForDisplay } from "../../../../application/usecases/formatDeliveryMarkdown";
import { Accordion } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";

export function formatDeliveryDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function deliveryPreview(content: string): string {
  const line = content.split("\n").find((part) => part.trim()) ?? content;
  return line.length > 80 ? `${line.slice(0, 80)}…` : line;
}

export function DeliveryReviewBlock(props: { review: ProjectDeliveryReview }) {
  const { review } = props;
  const { t } = useTranslation();
  const passed = passesDeliveryReview(review.score);

  return (
    <div
      className={
        passed
          ? "rounded-panel border border-successBorder bg-successFill p-3"
          : "rounded-panel border border-border0 bg-surfacePanel p-3"
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-body font-semibold text-text0">
          {t("delivery.scoreLabel", { score: review.score })}
        </span>
        {passed ? (
          <span className="text-meta font-medium text-successText">
            {t("delivery.passedAbove", { threshold: PROJECT_DELIVERY_PASS_SCORE })}
          </span>
        ) : (
          <span className="text-meta text-text1">
            {t("delivery.needsImprovement", { threshold: PROJECT_DELIVERY_PASS_SCORE })}
          </span>
        )}
      </div>
      <p className="m-0 mb-2 text-meta text-text1">
        {t("delivery.reviewedAt", { date: formatDeliveryDate(review.reviewedAt) })}
      </p>
      <div className="text-body text-text0">
        <MarkdownView markdown={review.comment} />
      </div>
    </div>
  );
}

function DeliveryHistoryItem(props: {
  entry: ProjectDeliveryEntry;
  index: number;
  total: number;
  defaultOpen?: boolean;
}) {
  const { entry, index, total, defaultOpen } = props;
  const { t } = useTranslation();
  const order = total - index;
  const displayMarkdown = formatDeliveryMarkdownForDisplay(entry.content);

  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        <div className="min-w-0">
          <p className="truncate text-body font-medium text-text0">
            {formatDeliveryDate(entry.submittedAt)}
            {entry.review ? ` · ${entry.review.score}/100` : ""}
          </p>
          <p className="truncate text-meta text-text1">
            {t("delivery.historyItem", { order, total })}
            {order === 1 ? t("delivery.historyLatest") : ""}
            {" · "}
            {deliveryPreview(entry.content)}
          </p>
        </div>
      }
    >
      <div className="grid gap-3">
        {entry.review ? <DeliveryReviewBlock review={entry.review} /> : null}
        <MarkdownView markdown={displayMarkdown} />
      </div>
    </Accordion>
  );
}

export function DeliveryHistoryList(props: {
  deliveries: ProjectDeliveryEntry[];
}) {
  const { t } = useTranslation();
  const reversed = [...props.deliveries].reverse();

  return (
    <div>
      <h3 className="mb-3 text-body font-medium text-text0">
        {t("delivery.previousHeading", { count: props.deliveries.length })}
      </h3>
      {props.deliveries.length === 0 ? (
        <p className="m-0 text-meta text-text1">{t("delivery.emptyDescription")}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {reversed.map((entry, index) => (
            <DeliveryHistoryItem
              key={entry.id}
              entry={entry}
              index={index}
              total={props.deliveries.length}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
