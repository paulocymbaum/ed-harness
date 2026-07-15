import { Flame } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { EmptyState, Icon } from "../../../design-system";

export function StreakCard(props: { streak: number }) {
  const { t } = useTranslation();
  const isEmpty = props.streak <= 0;
  const labelKey = props.streak === 1 ? "dashboard.streakDay" : "dashboard.streakDays";

  return (
    <div className="grid gap-2 rounded-panel border border-border0 bg-surfacePanel px-4 py-3">
      <div className="flex items-center gap-2 text-meta font-semibold text-text1">
        <Icon icon={Flame} size={16} className="text-accent0" />
        <span>{t("dashboard.streak")}</span>
      </div>

      {isEmpty ? (
        <EmptyState
          className="border-0 bg-transparent p-0"
          title={t("dashboard.streakEmpty.title")}
          description={t("dashboard.streakEmpty.description")}
        />
      ) : (
        <>
          <div className="text-title font-semibold text-text0">
            {t(labelKey, { count: props.streak })}
          </div>
          <p className="m-0 text-meta text-text1">{t("dashboard.streakHint")}</p>
        </>
      )}
    </div>
  );
}
