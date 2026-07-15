import { Activity } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { EmptyState, Icon } from "../../../design-system";

const BAR_TRACK_PX = 96;
const BAR_MIN_PX = 6;

export function ActivityMeter(props: {
  weeks: Array<{ weekStart: string; points: number }>;
  averagePointsPerWeek: number;
}) {
  const { t } = useTranslation();
  const hasWeeks = props.weeks.length > 0;
  const totalPoints = props.weeks.reduce((sum, week) => sum + week.points, 0);
  const isEmpty = !hasWeeks || totalPoints <= 0;
  const maxPoints = Math.max(1, ...props.weeks.map((w) => w.points));
  const avgLabel = formatAverage(props.averagePointsPerWeek);

  return (
    <div className="grid gap-2 rounded-panel border border-border0 bg-surfacePanel px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-meta font-semibold text-text1">
          <Icon icon={Activity} size={16} className="text-accent0" />
          <span>{t("dashboard.activity")}</span>
        </div>
        {!isEmpty ? (
          <span className="text-meta font-medium text-text0">
            {t("dashboard.averagePerWeek", { avg: avgLabel })}
          </span>
        ) : null}
      </div>

      {isEmpty ? (
        <EmptyState
          className="border-0 bg-transparent p-0"
          title={t("dashboard.activityEmpty.title")}
          description={t("dashboard.activityEmpty.description")}
        />
      ) : (
        <div
          className="flex items-end gap-2 pt-1"
          role="img"
          aria-label={t("dashboard.averagePerWeek", { avg: avgLabel })}
        >
          {props.weeks.map((week) => {
            const heightPx =
              week.points > 0
                ? Math.max(BAR_MIN_PX, Math.round((week.points / maxPoints) * BAR_TRACK_PX))
                : 0;

            return (
              <div key={week.weekStart} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span className="text-[0.65rem] font-medium tabular-nums text-text0">
                  {week.points}
                </span>
                <div
                  className="flex w-full items-end justify-center rounded-sm bg-surfaceControl"
                  style={{ height: BAR_TRACK_PX }}
                >
                  <div
                    className="w-full max-w-[2.25rem] rounded-sm bg-accent0"
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
