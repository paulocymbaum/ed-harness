import clsx from "clsx";
import { ChevronDown, Layers } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "../../../../../application/hooks/useTranslation";
import { formatScoreLabel } from "../../../../../domain/scoreProgress";
import { Icon, ProgressBar } from "../../../../design-system";

export function ModuleSectionAccordion(props: {
  sectionKey: string;
  sectionLabel: string;
  scorePoints?: { value: number; max: number };
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const hasScore = (props.scorePoints?.max ?? 0) > 0;
  const hasDistinctLabel = props.sectionLabel !== props.sectionKey;
  const progressPercent =
    hasScore && props.scorePoints
      ? Math.round((props.scorePoints.value / props.scorePoints.max) * 100)
      : 0;

  return (
    <details className="group mb-1 min-w-0" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex min-w-0 cursor-pointer list-none flex-col gap-1.5 rounded-panel px-2 py-2",
          "[&::-webkit-details-marker]:hidden",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
        )}
      >
        <div className="flex min-h-7 min-w-0 items-start gap-2">
          <Icon icon={Layers} size={14} className="mt-0.5 shrink-0 text-text1" />
          <span className="min-w-0 flex-1">
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="shrink-0 font-mono text-meta font-semibold text-accent0">
                {props.sectionKey}
              </span>
              {hasDistinctLabel ? (
                <span className="min-w-0 text-meta leading-snug text-text1 [overflow-wrap:anywhere]">
                  {props.sectionLabel}
                </span>
              ) : null}
            </span>
          </span>
          {hasScore && props.scorePoints ? (
            <span className="shrink-0 pt-0.5 text-meta font-medium text-text0">
              {formatScoreLabel(props.scorePoints.value, props.scorePoints.max)}
            </span>
          ) : null}
          <Icon
            icon={ChevronDown}
            size={14}
            className="mt-0.5 shrink-0 text-text1 transition group-open:rotate-180"
          />
        </div>
        {hasScore && props.scorePoints && progressPercent > 0 ? (
          <div
            className="min-w-0 pl-6 pr-1"
            onClick={(event) => event.stopPropagation()}
          >
            <ProgressBar
              value={props.scorePoints.value}
              max={props.scorePoints.max}
              size="xs"
              aria-label={`${t("lesson.score")}: ${formatScoreLabel(props.scorePoints.value, props.scorePoints.max)}`}
            />
          </div>
        ) : null}
      </summary>
      <div className="ml-2 min-w-0 grid gap-0.5 border-l border-border0 py-1 pl-2">
        {props.children}
      </div>
    </details>
  );
}
