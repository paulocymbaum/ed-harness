import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { Button } from "../../../design-system";

export function LessonNextSteps(props: {
  courseId: string;
  moduleId: string;
  lessonId: string;
  firstQuizId?: string;
  firstProjectId?: string;
}) {
  const { t } = useTranslation();
  const { abrirQuizLicao, abrirProjetoLicao } = useAppNavigation();

  if (!props.firstQuizId && !props.firstProjectId) return null;

  return (
    <section className="mt-6 rounded-panel border border-border0 bg-surfacePanel p-4">
      <h2 className="m-0 mb-3 text-body font-semibold text-text0">{t("lesson.nextSteps")}</h2>
      <div className="flex flex-wrap gap-2">
        {props.firstQuizId ? (
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              abrirQuizLicao(
                props.courseId,
                props.moduleId,
                props.lessonId,
                props.firstQuizId!,
              )
            }
          >
            {t("lesson.takeQuiz")}
          </Button>
        ) : null}
        {props.firstProjectId ? (
          <Button
            variant={props.firstQuizId ? "secondary" : "primary"}
            size="md"
            onClick={() =>
              abrirProjetoLicao(
                props.courseId,
                props.moduleId,
                props.lessonId,
                props.firstProjectId!,
              )
            }
          >
            {t("lesson.openProject")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
