import { useTranslation } from "../../../../application/hooks/useTranslation";
import { ActivityMeter } from "./ActivityMeter";
import { StreakCard } from "./StreakCard";

export function LearnerDashboard(props: {
  streak: number;
  weeks: Array<{ weekStart: string; points: number }>;
  averagePointsPerWeek: number;
  variant?: "default" | "compact";
}) {
  const { t } = useTranslation();
  const variant = props.variant ?? "default";

  if (variant === "compact") {
    return (
      <section
        className="@container grid gap-2"
        aria-label={t("catalog.yourPace")}
        data-tour="dashboard-compact"
      >
        <p className="m-0 text-meta font-semibold text-text1">{t("catalog.yourPace")}</p>
        <div className="grid grid-cols-1 items-stretch gap-2 @[18rem]:grid-cols-[auto_minmax(0,1fr)]">
          <StreakCard streak={props.streak} variant="compact" />
          <ActivityMeter
            weeks={props.weeks}
            averagePointsPerWeek={props.averagePointsPerWeek}
            variant="compact"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-3" aria-label={t("dashboard.ariaLabel")} data-tour="dashboard">
      <div className="grid gap-3 sm:grid-cols-2">
        <StreakCard streak={props.streak} />
        <ActivityMeter
          weeks={props.weeks}
          averagePointsPerWeek={props.averagePointsPerWeek}
        />
      </div>
    </section>
  );
}
