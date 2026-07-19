import { useQuizSessionStore } from "../stores/quizSessionStore";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";
import {
  caminhoLicao,
  caminhoProjetoLicao,
  caminhoQuizLicao,
} from "./caminhosHierarquia";
import type { EstrategiaNavegacaoCurso, NavegacaoCursoDeps } from "./tiposNavegacaoCurso";

export function criarEstrategiaHierarquia(deps: NavegacaoCursoDeps): Pick<
  EstrategiaNavegacaoCurso,
  | "goModule"
  | "goLesson"
  | "abrirQuizLicao"
  | "abrirProjetoLicao"
  | "voltarParaLicao"
  | "openModuleQuiz"
  | "closeQuiz"
> {
  const { navigate, searchParams, setSearchParams } = deps;

  return {
    goModule: (courseId, moduleId) => {
      closeReaderBeforeNavigate();
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}`,
      );
    },

    goLesson: (courseId, moduleId, lessonId) => {
      navigate(caminhoLicao(courseId, moduleId, lessonId));
    },

    abrirQuizLicao: (courseId, moduleId, lessonId, quizId) => {
      useQuizSessionStore.getState().start(quizId, lessonId);
      navigate(caminhoQuizLicao(courseId, moduleId, lessonId, quizId));
    },

    abrirProjetoLicao: (courseId, moduleId, lessonId, projectId) => {
      navigate(caminhoProjetoLicao(courseId, moduleId, lessonId, projectId));
    },

    voltarParaLicao: (courseId, moduleId, lessonId) => {
      useQuizSessionStore.getState().reset();
      navigate(caminhoLicao(courseId, moduleId, lessonId));
    },

    openModuleQuiz: (courseId, moduleId, quizId) => {
      useQuizSessionStore.getState().start(quizId);
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}?quiz=${encodeURIComponent(quizId)}`,
      );
    },

    closeQuiz: () => {
      useQuizSessionStore.getState().reset();
      const params = new URLSearchParams(searchParams);
      params.delete("quiz");
      setSearchParams(params, { replace: true });
    },
  };
}
