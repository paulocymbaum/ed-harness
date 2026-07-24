import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../../application/hooks/useTranslation";
import {
  getLessonById,
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../application/selectors/catalogSelectors";
import { findQuizInList } from "../../../application/selectors/quizSelectors";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { redirecionarDrawerLegado } from "../../../application/navigation/redirecionarDrawerLegado";
import { ErrorPanel } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { LessonVideosAccordion } from "./components/LessonVideosAccordion";
import { useModuleLayoutContext } from "../module-experience/ModuleLayoutContext";

export function LessonWorkspaceRoute() {
  const { t } = useTranslation();
  const { courseId, moduleId, course } = useModuleLayoutContext();
  const { lessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { parseDrawerMode } = useAppNavigation();

  const drawerMode = parseDrawerMode(searchParams.get("drawer"));
  const activeQuizId = searchParams.get("quiz");
  const activeProjectId = searchParams.get("project");

  const lesson = getLessonById(course, moduleId, lessonId);
  if (!lesson) {
    return <ErrorPanel title={t("error.lessonNotFound")} />;
  }

  const lessonQuizzes = getQuizzesForLesson(course, moduleId, lessonId);
  const lessonProjects = getProjectsForLesson(course, moduleId, lessonId);
  const quizExists = Boolean(
    activeQuizId && findQuizInList(lessonQuizzes, activeQuizId),
  );
  const projectExists = Boolean(
    activeProjectId && lessonProjects.some((p) => p.id === activeProjectId),
  );

  const destinoLegado = redirecionarDrawerLegado({
    courseId,
    moduleId,
    lessonId,
    drawerMode,
    activeQuizId,
    activeProjectId,
    quizExists,
    projectExists,
  });

  if (destinoLegado) {
    return <Navigate to={destinoLegado} replace />;
  }

  const videos = lesson.videos ?? [];

  return (
    <section className="flex flex-col">
      <main className="min-w-0 flex-1">
        <div className="p-4">
          {videos.length > 0 ? <LessonVideosAccordion videos={videos} /> : null}
          <ReadmePanel title={lesson.title} markdown={lesson.markdown} showTitle={false} variant="inline" />
        </div>
      </main>
    </section>
  );
}
