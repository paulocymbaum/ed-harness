import { useParams } from "react-router-dom";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import {
  getLessonById,
  getQuizzesForLesson,
} from "../../../application/selectors/catalogSelectors";
import { findQuizInList } from "../../../application/selectors/quizSelectors";
import { ErrorPanel } from "../../design-system";
import { QuizSessaoFoco } from "../quiz/components/QuizSessaoFoco";
import { useModuleLayoutContext } from "../module-experience/ModuleLayoutContext";

export function RotaQuizLicao() {
  const { t } = useTranslation();
  const { courseId, moduleId, course } = useModuleLayoutContext();
  const { lessonId = "", quizId = "" } = useParams();
  const { voltarParaLicao } = useAppNavigation();

  useQuizSessionFromUrl({
    quizId,
    lessonId,
    moduleId,
    enabled: Boolean(quizId),
  });

  const lesson = getLessonById(course, moduleId, lessonId);
  if (!lesson) {
    return <ErrorPanel title={t("error.lessonNotFound")} />;
  }

  const lessonQuizzes = getQuizzesForLesson(course, moduleId, lessonId);
  const quiz = findQuizInList(lessonQuizzes, quizId);
  if (!quiz) {
    return <ErrorPanel title={t("error.quizNotFound")} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <QuizSessaoFoco
        courseId={courseId}
        course={course}
        quiz={quiz}
        lessonMarkdown={lesson.markdown}
        lessonTitle={lesson.title}
        onVoltar={() => voltarParaLicao(courseId, moduleId, lessonId)}
      />
    </div>
  );
}
