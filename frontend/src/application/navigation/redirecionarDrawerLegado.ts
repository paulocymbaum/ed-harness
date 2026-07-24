import {
  caminhoLicao,
  caminhoProjetoLicao,
  caminhoQuizLicao,
} from "./caminhosHierarquia";

/** Redirects legacy `?drawer=` deep links to dedicated focus routes. */
export function redirecionarDrawerLegado(args: {
  courseId: string;
  moduleId: string;
  lessonId: string;
  drawerMode: "quiz" | "project" | null;
  activeQuizId: string | null;
  activeProjectId: string | null;
  quizExists: boolean;
  projectExists: boolean;
}): string | null {
  const {
    courseId,
    moduleId,
    lessonId,
    drawerMode,
    activeQuizId,
    activeProjectId,
    quizExists,
    projectExists,
  } = args;

  if (drawerMode === "quiz") {
    if (activeQuizId && quizExists) {
      return caminhoQuizLicao(courseId, moduleId, lessonId, activeQuizId);
    }
    return caminhoLicao(courseId, moduleId, lessonId);
  }

  if (drawerMode === "project") {
    if (activeProjectId && projectExists) {
      return caminhoProjetoLicao(courseId, moduleId, lessonId, activeProjectId);
    }
    return caminhoLicao(courseId, moduleId, lessonId);
  }

  return null;
}
