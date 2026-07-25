import { Flame } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { EmptyState, Icon } from "../../../design-system";

export function StreakCard(props: {
  streak: number;
  variant?: "default" | "compact";
}) {
  const { t } = useTranslation();
  const variant = props.variant ?? "default";
  const isEmpty = props.streak <= 0;
  const labelKey = props.streak === 1 ? "dashboard.streakDay" : "dashboard.streakDays";
  const streakLabel = isEmpty
    ? "0"
    : t(labelKey, { count: props.streak });

  if (variant === "compact") {
    return (
      <div
        className="inline-flex w-full flex-row items-center justify-between gap-2 rounded-panel border border-border0 bg-surfacePanel px-2.5 py-2 @[18rem]:w-auto @[18rem]:min-w-[3.5rem] @[18rem]:flex-col @[18rem]:justify-center @[18rem]:px-2"
        aria-label={`${t("dashboard.streak")}: ${streakLabel}`}
      >
        <div className="flex items-center gap-1 text-meta font-semibold text-text1">
          <Icon icon={Flame} size={14} className="text-accent0" />
          <span>{t("dashboard.streak")}</span>
        </div>
        <span className="text-body font-semibold tabular-nums text-text0">{props.streak}</span>
      </div>
    );
  }

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
