import type { Course } from "../../../../domain/types/catalog";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { useModuleCompletion } from "../../../../application/hooks/useModuleCompletion";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Card, Icon } from "../../../design-system";
import { ModuleScoreSummary } from "../../course-experience/components/ModuleScoreSummary";
import { Box, ChevronRight } from "lucide-react";

function ModuleCard(props: {
  courseId: string;
  module: NonNullable<Course["modules"]>[number];
}) {
  const { goModule } = useAppNavigation();
  const { t } = useTranslation();
  const { hasProgress } = useModuleCompletion(props.courseId, props.module);
  const mod = props.module;
  const moduleQuizzes = mod.quizzes.filter((q) => !q.lessonId).length;
  const lessonQuizzes = mod.quizzes.filter((q) => q.lessonId).length;
  const moduleIndex = mod.graphIndex ?? mod.id.match(/^(\d+)/)?.[1] ?? "";

  return (
    <Card variant="panel" className="overflow-hidden p-0">
      <button
        type="button"
        className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-surfacePanel/60"
        onClick={() => goModule(props.courseId, mod.id)}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel border border-accent0/25 bg-surfaceAccent text-accent0"
          aria-hidden
        >
          <Icon icon={Box} size={20} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {moduleIndex ? (
              <span className="rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 font-mono text-meta font-semibold text-accent0">
                {moduleIndex}
              </span>
            ) : null}
            <span className="text-body font-semibold text-text0">{mod.title}</span>
            {hasProgress ? (
              <span className="rounded-pill border border-accent0/30 bg-surfaceAccent px-2 py-0.5 text-meta font-medium text-accent0">
                {t("course.continueModule")}
              </span>
            ) : null}
          </span>
          <span className="mt-2 block text-meta text-text1">
            {t("course.moduleLessons", {
              lessons: mod.lessons.length,
              projects: mod.projects.length,
            })}
            {lessonQuizzes > 0 ? t("course.lessonQuizSuffix", { count: lessonQuizzes }) : ""}
            {moduleQuizzes > 0 ? t("course.moduleQuizSuffix", { count: moduleQuizzes }) : ""}
          </span>
          <ModuleScoreSummary courseId={props.courseId} module={mod} />
        </span>

        <Icon icon={ChevronRight} size={18} className="mt-1 shrink-0 text-text1" />
      </button>
    </Card>
  );
}

export function ModuleList(props: {
  courseId: string;
  modules: NonNullable<Course["modules"]>;
}) {
  const { t } = useTranslation();

  if (props.modules.length === 0) return null;

  return (
    <section className="grid gap-3">
      <h2 className="m-0 text-body font-semibold text-text0">{t("course.modulesHeading")}</h2>
      <div className="grid gap-4">
        {props.modules.map((mod) => (
          <ModuleCard key={mod.id} courseId={props.courseId} module={mod} />
        ))}
      </div>
    </section>
  );
}
