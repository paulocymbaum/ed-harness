import { useParams, useSearchParams } from "react-router-dom";
import { useAppNavigation } from "./useAppNavigation";

/** URL-derived selection state shared by module shell and contents drawer. */
export function useModuleUrlState() {
  const {
    lessonId: activeLessonId = "",
    quizId: quizIdParam = "",
    projectId: projectIdParam = "",
  } = useParams();
  const [searchParams] = useSearchParams();
  const { parseDrawerMode } = useAppNavigation();

  const activeQuizId = quizIdParam || searchParams.get("quiz");
  const activeProjectId = projectIdParam || searchParams.get("project");
  const drawerMode =
    quizIdParam
      ? ("quiz" as const)
      : projectIdParam
        ? ("project" as const)
        : parseDrawerMode(searchParams.get("drawer"));

  const isModuleContextActive =
    !activeLessonId && !activeQuizId && !activeProjectId && !drawerMode;

  return {
    activeLessonId,
    activeQuizId,
    activeProjectId,
    drawerMode,
    isModuleContextActive,
  };
}
