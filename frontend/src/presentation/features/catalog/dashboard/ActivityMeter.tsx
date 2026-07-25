import { Activity } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { EmptyState, Icon } from "../../../design-system";

const BAR_TRACK_DEFAULT_PX = 96;
const BAR_TRACK_COMPACT_PX = 56;
const BAR_MIN_PX = 6;

export function ActivityMeter(props: {
  weeks: Array<{ weekStart: string; points: number }>;
  averagePointsPerWeek: number;
  variant?: "default" | "compact";
}) {
  const { t } = useTranslation();
  const variant = props.variant ?? "default";
  const isCompact = variant === "compact";
  const barTrackPx = isCompact ? BAR_TRACK_COMPACT_PX : BAR_TRACK_DEFAULT_PX;
  const hasWeeks = props.weeks.length > 0;
  const totalPoints = props.weeks.reduce((sum, week) => sum + week.points, 0);
  const isEmpty = !hasWeeks || totalPoints <= 0;
  const maxPoints = Math.max(1, ...props.weeks.map((w) => w.points));
  const avgLabel = formatAverage(props.averagePointsPerWeek);

  return (
    <div
      className={
        isCompact
          ? "grid min-w-0 gap-1.5 rounded-panel border border-border0 bg-surfacePanel px-2.5 py-2"
          : "grid gap-2 rounded-panel border border-border0 bg-surfacePanel px-4 py-3"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <div className="flex min-w-0 items-center gap-2 text-meta font-semibold text-text1">
          <Icon icon={Activity} size={isCompact ? 14 : 16} className="shrink-0 text-accent0" />
          <span className="truncate">{t("dashboard.activity")}</span>
        </div>
        {!isEmpty ? (
          <span className="shrink-0 text-meta font-medium text-text0">
            {t("dashboard.averagePerWeek", { avg: avgLabel })}
          </span>
        ) : null}
      </div>

      {isEmpty ? (
        <EmptyState
          className="border-0 bg-transparent p-0"
          title={t("dashboard.activityEmpty.title")}
          description={isCompact ? undefined : t("dashboard.activityEmpty.description")}
        />
      ) : (
        <div
          className="flex items-end gap-1.5 pt-0.5"
          role="img"
          aria-label={t("dashboard.averagePerWeek", { avg: avgLabel })}
        >
          {props.weeks.map((week) => {
            const heightPx =
              week.points > 0
                ? Math.max(BAR_MIN_PX, Math.round((week.points / maxPoints) * barTrackPx))
                : 0;

            return (
              <div key={week.weekStart} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span className="text-[0.65rem] font-medium tabular-nums text-text0">
                  {week.points}
                </span>
                <div
                  className="flex w-full items-end justify-center rounded-sm bg-surfaceControl"
                  style={{ height: barTrackPx }}
                >
                  <div
                    className={
                      isCompact
                        ? "w-full max-w-[1.75rem] rounded-sm bg-accent0 @[22rem]:max-w-[2.25rem]"
                        : "w-full max-w-[2.25rem] rounded-sm bg-accent0"
                    }
                    style={{ height: heightPx }}
                    title={t("dashboard.weekPoints", { points: week.points })}
                  />
                </div>
                <span className="truncate text-[0.65rem] text-text1">
                  {formatWeekLabel(week.weekStart)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatAverage(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
}

function formatWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  if (!y || !m || !d) return weekStart;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
