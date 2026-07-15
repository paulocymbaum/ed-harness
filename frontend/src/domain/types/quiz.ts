export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
};

/** Embedded in catalog.json after generation. */
export type Quiz = {
  id: string;
  title: string;
  description?: string;
  /** POSIX path to source JSON under course/ */
  path: string;
  questions: QuizQuestion[];
  lessonId?: string;
  moduleId?: string;
  graphIndex?: string;
};

export type QuizAttempt = {
  score: number;
  total: number;
  completedAt: string;
};

export type QuizProgress = {
  bestScore: number;
  bestTotal: number;
  attempts: number;
  lastAttempt?: QuizAttempt;
};

export type QuizAnswerMap = Record<string, string>;

export function scoreQuiz(questions: QuizQuestion[], answers: QuizAnswerMap): QuizAttempt {
  let score = 0;
  for (const question of questions) {
    if (answers[question.id] === question.correctOptionId) score += 1;
  }
  return {
    score,
    total: questions.length,
    completedAt: new Date().toISOString(),
  };
}

export function quizProgressKey(
  courseId: string,
  quizId: string,
  lessonId?: string,
  moduleId?: string,
): string {
  return `${courseId}:quiz:${moduleId ?? "_"}:${lessonId ?? "_"}:${quizId}`;
}

/** Pre-moduleId key format (shared across mocks with the same lessonId). */
export function legacyQuizProgressKeyWithLesson(
  courseId: string,
  quizId: string,
  lessonId?: string,
): string {
  return `${courseId}:quiz:${lessonId ?? "_"}:${quizId}`;
}

export function legacyQuizProgressKey(courseId: string, quizId: string): string {
  return `${courseId}:${quizId}`;
}

/**
 * Resolve quiz progress across key formats.
 * Mock modules (`*-mock`) only match the module-scoped key — never shared
 * lesson-only / `_` keys (all mocks reuse `01.2-multiple-choice`).
 */
export function lookupQuizProgressEntry<T>(
  byKey: Record<string, T | undefined>,
  courseId: string,
  quizId: string,
  lessonId?: string,
  moduleId?: string,
): T | undefined {
  const scoped = quizProgressKey(courseId, quizId, lessonId, moduleId);
  if (moduleId?.endsWith("-mock")) {
    return byKey[scoped];
  }

  const candidates = [
    scoped,
    quizProgressKey(courseId, quizId, lessonId),
    legacyQuizProgressKeyWithLesson(courseId, quizId, lessonId),
    legacyQuizProgressKey(courseId, quizId),
  ];

  for (const key of candidates) {
    const hit = byKey[key];
    if (hit !== undefined) return hit;
  }
  return undefined;
}
