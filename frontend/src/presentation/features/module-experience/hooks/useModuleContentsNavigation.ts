import { useMemo } from "react";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { useModuleLayoutContext } from "../ModuleLayoutContext";

export type ModuleContentsNavigation = {
  openModuleContext: () => void;
  openLesson: (lessonId: string) => void;
  openLessonQuiz: (lessonId: string, quizId: string) => void;
  openLessonProject: (lessonId: string, projectId: string) => void;
  openModuleQuiz: (quizId: string) => void;
};

/** Navigation actions for the module contents drawer, bound to the current route context. */
export function useModuleContentsNavigation(): ModuleContentsNavigation {
  const { courseId, moduleId } = useModuleLayoutContext();
  const { goModule, goLesson, abrirQuizLicao, abrirProjetoLicao, openModuleQuiz } =
    useAppNavigation();

  return useMemo(
    () => ({
      openModuleContext: () => goModule(courseId, moduleId),
      openLesson: (lessonId: string) => goLesson(courseId, moduleId, lessonId),
      openLessonQuiz: (lessonId: string, quizId: string) =>
        abrirQuizLicao(courseId, moduleId, lessonId, quizId),
      openLessonProject: (lessonId: string, projectId: string) =>
        abrirProjetoLicao(courseId, moduleId, lessonId, projectId),
      openModuleQuiz: (quizId: string) => openModuleQuiz(courseId, moduleId, quizId),
    }),
    [courseId, moduleId, goModule, goLesson, abrirQuizLicao, abrirProjetoLicao, openModuleQuiz],
  );
}
