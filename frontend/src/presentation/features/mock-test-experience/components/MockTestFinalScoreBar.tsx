import clsx from "clsx";
import { submissionScoreTier } from "../../../../domain/scoreProgress";
import { useTranslation } from "../../../../application/hooks/useTranslation";

const TIER_FILL: Record<ReturnType<typeof submissionScoreTier>, string> = {
  success: "bg-success0",
  warning: "bg-amber-400",
  danger: "bg-danger0",
};

export function MockTestFinalScoreBar(props: {
  percent: number;
  passed: boolean;
  passingScorePercent: number;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const percent = Math.min(100, Math.max(0, Math.round(props.percent)));
  const tier = submissionScoreTier(percent);

  return (
    <div
      className={clsx("grid gap-1", props.className)}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <p className="m-0 text-meta text-text2">{t("mockTest.finalScore")}</p>
        {props.passed ? (
          <span className="rounded-pill border border-successBorder bg-successFill px-2 py-0.5 text-meta font-medium text-successText">
            {t("mockTest.finalScorePassed", { percent: props.passingScorePercent })}
          </span>
        ) : (
          <span className="rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 text-meta font-medium text-text1">
            {t("mockTest.finalScoreBelowPass", { percent: props.passingScorePercent })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "overflow-hidden rounded-pill border border-border0 bg-surfacePanel",
            props.compact ? "h-1 min-w-0 flex-1" : "h-1.5 min-w-0 flex-1",
          )}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("mockTest.finalScoreAria", { percent })}
        >
          <div
            className={clsx(
              "h-full rounded-pill transition-[width] motion-reduce:transition-none",
              TIER_FILL[tier],
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="shrink-0 text-meta font-medium text-text1">{percent}%</span>
      </div>
    </div>
  );
}
