import type { Module } from "../../../../domain/types/catalog";
import { ProgressBar } from "../../../design-system";
import { useModuleCompletion } from "../../../../application/hooks/useModuleCompletion";
import { useTranslation } from "../../../../application/hooks/useTranslation";

export function ModuleScoreSummary(props: { courseId: string; module: Module }) {
  const { t } = useTranslation();
  const { done, total } = useModuleCompletion(props.courseId, props.module);

  if (total === 0) return null;

  return (
    <ProgressBar
      value={done}
      max={total}
      size="xs"
      aria-label={t("lesson.activitiesComplete", { done, total })}
    />
  );
}
