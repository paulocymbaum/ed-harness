import { create } from "zustand";
import { embaralharPerguntasQuiz } from "../../domain/embaralharOpcoesQuiz";
import type { QuizAnswerMap, QuizAttempt, Quiz, QuizQuestion } from "../../domain/types/quiz";
import { scoreQuiz } from "../../domain/types/quiz";
import { persistQuizScore } from "../usecases/courseScores";
import { quizSessionKey } from "../selectors/quizSelectors";
import { useQuizProgressStore } from "./quizProgressStore";

type QuizSessionState = {
  quizId: string | null;
  lessonId: string | null;
  moduleId: string | null;
  sessionKey: string | null;
  perguntasEmbaralhadas: QuizQuestion[] | null;
  currentIndex: number;
  answers: QuizAnswerMap;
  checkedQuestions: Record<string, boolean>;
  isComplete: boolean;
  lastAttempt: QuizAttempt | null;
  lastQuizPointsDelta: number;
  start: (
    quizId: string,
    lessonId?: string,
    perguntas?: QuizQuestion[],
    moduleId?: string,
  ) => void;
  garantirPerguntasEmbaralhadas: (perguntas: QuizQuestion[]) => void;
  reset: () => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  checkCurrent: (questionId: string) => void;
  goNext: (totalQuestions: number) => void;
  goPrev: () => void;
  finish: (quiz: Quiz, courseId: string) => QuizAttempt;
};

const initialSession = {
  quizId: null as string | null,
  lessonId: null as string | null,
  moduleId: null as string | null,
  sessionKey: null as string | null,
  perguntasEmbaralhadas: null as QuizQuestion[] | null,
  currentIndex: 0,
  answers: {} as QuizAnswerMap,
  checkedQuestions: {} as Record<string, boolean>,
  isComplete: false,
  lastAttempt: null as QuizAttempt | null,
  lastQuizPointsDelta: 0,
};

export const useQuizSessionStore = create<QuizSessionState>((set, get) => ({
  ...initialSession,
  start: (quizId, lessonId, perguntas, moduleId) => {
    const sessionKey = quizSessionKey(quizId, lessonId, moduleId);
    set({
      quizId,
      lessonId: lessonId ?? null,
      moduleId: moduleId ?? null,
      sessionKey,
      perguntasEmbaralhadas: perguntas ? embaralharPerguntasQuiz(perguntas) : null,
      currentIndex: 0,
      answers: {},
      checkedQuestions: {},
      isComplete: false,
      lastAttempt: null,
      lastQuizPointsDelta: 0,
    });
  },
  reset: () => set(initialSession),
  garantirPerguntasEmbaralhadas: (perguntas) => {
    if (get().perguntasEmbaralhadas) return;
    set({ perguntasEmbaralhadas: embaralharPerguntasQuiz(perguntas) });
  },
  selectAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),
  checkCurrent: (questionId) =>
    set((state) => ({
      checkedQuestions: { ...state.checkedQuestions, [questionId]: true },
    })),
  goNext: (totalQuestions) =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, totalQuestions - 1),
    })),
  goPrev: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),
  finish: (quiz, courseId) => {
    const lessonId = quiz.lessonId ?? get().lessonId ?? undefined;
    const moduleId = quiz.moduleId;
    const perguntas = get().perguntasEmbaralhadas ?? quiz.questions;
    const attempt = scoreQuiz(perguntas, get().answers);
    const prevBest =
      useQuizProgressStore.getState().getProgress(courseId, quiz.id, lessonId, moduleId)
        ?.bestScore ?? 0;
    useQuizProgressStore.getState().recordAttempt(courseId, quiz.id, attempt, lessonId, moduleId);
    void persistQuizScore(courseId, quiz.id, attempt, lessonId, moduleId);
    const lastQuizPointsDelta = Math.max(0, attempt.score - prevBest);
    set({ isComplete: true, lastAttempt: attempt, lastQuizPointsDelta });
    return attempt;
  },
}));
