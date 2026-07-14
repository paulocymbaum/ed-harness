import type { Course } from "../../../../domain/types/catalog";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { ActivityMeter } from "./ActivityMeter";
import { StreakCard } from "./StreakCard";

export function LearnerDashboard(props: {
  streak: number;
  weeks: Array<{ weekStart: string; points: number }>;
  averagePointsPerWeek: number;
}) {
  const { t } = useTranslation();

  return (
    <section className="grid gap-3" aria-label={t("dashboard.ariaLabel")}>
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
