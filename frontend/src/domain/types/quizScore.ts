import type { Course } from "./catalog";
import type { QuizAttempt } from "./quiz";
import { quizProgressKey, type QuizProgress } from "./quiz";

export const SCORE_FILE_VERSION = 2 as const;
export const SCORE_FILE_VERSION_LEGACY = 1 as const;
export const PROJECT_POINTS_WEIGHT = 4;

export type ProjectStatus = "pending" | "doing" | "done";

export type QuizScoreEntry = {
  quizId: string;
  bestScore: number;
  bestTotal: number;
  attempts: QuizAttempt[];
};

export type ProjectScoreEntry = {
  projectId: string;
  status: ProjectStatus;
  points: number;
  updatedAt: string;
};

/** Persisted at course/<courseId>/quiz/score.json */
export type CourseScoreFile = {
  version: typeof SCORE_FILE_VERSION | typeof SCORE_FILE_VERSION_LEGACY;
  courseId: string;
  updatedAt: string;
  quizzes: Record<string, QuizScoreEntry>;
  projects: Record<string, ProjectScoreEntry>;
};

export function emptyCourseScoreFile(courseId: string): CourseScoreFile {
  return {
    version: SCORE_FILE_VERSION,
    courseId,
    updatedAt: new Date().toISOString(),
    quizzes: {},
    projects: {},
  };
}

export function courseScoreRelativePath(courseId: string): string {
  return `course/${courseId}/quiz/score.json`;
}

const PROJECT_STATUSES: ProjectStatus[] = ["pending", "doing", "done"];

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && PROJECT_STATUSES.includes(value as ProjectStatus);
}

function isValidQuizScoreEntry(entry: unknown): entry is QuizScoreEntry {
  if (!entry || typeof entry !== "object") return false;
  const value = entry as QuizScoreEntry;
  if (typeof value.quizId !== "string") return false;
  if (typeof value.bestScore !== "number" || typeof value.bestTotal !== "number") return false;
  if (!Array.isArray(value.attempts)) return false;
  return value.attempts.every(
    (attempt) =>
      attempt &&
      typeof attempt.score === "number" &&
      typeof attempt.total === "number" &&
      typeof attempt.completedAt === "string",
  );
}

function isValidProjectScoreEntry(entry: unknown): entry is ProjectScoreEntry {
  if (!entry || typeof entry !== "object") return false;
  const value = entry as ProjectScoreEntry;
  if (typeof value.projectId !== "string") return false;
  if (!isProjectStatus(value.status)) return false;
  if (typeof value.points !== "number") return false;
  return typeof value.updatedAt === "string";
}

export function normalizeCourseScoreFile(value: unknown, courseId?: string): CourseScoreFile | null {
  if (!value || typeof value !== "object") return null;
  const file = value as CourseScoreFile;
  const version = file.version;
  if (version !== SCORE_FILE_VERSION && version !== SCORE_FILE_VERSION_LEGACY) return null;
  if (typeof file.courseId !== "string") return null;
  const resolvedCourseId = courseId && file.courseId !== courseId ? courseId : file.courseId;
  if (!file.quizzes || typeof file.quizzes !== "object") return null;
  if (!Object.values(file.quizzes).every(isValidQuizScoreEntry)) return null;

  const projects =
    file.projects && typeof file.projects === "object" ? file.projects : {};
  if (!Object.values(projects).every(isValidProjectScoreEntry)) return null;

  return {
    version: SCORE_FILE_VERSION,
    courseId: resolvedCourseId,
    updatedAt: typeof file.updatedAt === "string" ? file.updatedAt : new Date().toISOString(),
    quizzes: file.quizzes,
    projects,
  };
}

export function isValidCourseScoreFile(value: unknown): value is CourseScoreFile {
  return normalizeCourseScoreFile(value) !== null;
}

export function scoreStorageKeyForQuiz(
  quizId: string,
  lessonId?: string,
  moduleId?: string,
): string {
  if (moduleId && lessonId) return `${moduleId}/${lessonId}/${quizId}`;
  if (lessonId) return `${lessonId}/${quizId}`;
  return quizId;
}

export function scoreStorageKeyForProject(
  projectId: string,
  lessonId?: string,
  moduleId?: string,
): string {
  if (moduleId && lessonId) return `${moduleId}/${lessonId}/${projectId}`;
  if (lessonId) return `${lessonId}/${projectId}`;
  return projectId;
}

export function projectProgressKey(
  courseId: string,
  projectId: string,
  lessonId?: string,
  moduleId?: string,
): string {
  return `${courseId}:project:${moduleId ?? "_"}:${lessonId ?? "_"}:${projectId}`;
}

/** Pre-moduleId key format. */
export function legacyProjectProgressKeyWithLesson(
  courseId: string,
  projectId: string,
  lessonId?: string,
): string {
  return `${courseId}:project:${lessonId ?? "_"}:${projectId}`;
}

/** Legacy key format before hierarchy migration */
export function legacyProjectProgressKey(courseId: string, projectId: string): string {
  return `${courseId}:${projectId}`;
}

export function lookupProjectProgressEntry<T>(
  byKey: Record<string, T | undefined>,
  courseId: string,
  projectId: string,
  lessonId?: string,
  moduleId?: string,
): T | undefined {
  const candidates = [
    projectProgressKey(courseId, projectId, lessonId, moduleId),
    // Deliveries still write `_` module slot; project ids are unique across mocks.
    projectProgressKey(courseId, projectId, lessonId),
  ];

  if (!moduleId?.endsWith("-mock")) {
    candidates.push(legacyProjectProgressKeyWithLesson(courseId, projectId, lessonId));
    candidates.push(legacyProjectProgressKey(courseId, projectId));
  }

  for (const key of candidates) {
    const hit = byKey[key];
    if (hit !== undefined) return hit;
  }
  return undefined;
}

export function legacyQuizProgressKey(courseId: string, quizId: string): string {
  return `${courseId}:${quizId}`;
}

export function projectPointsForStatus(status: ProjectStatus): number {
  return status === "done" ? PROJECT_POINTS_WEIGHT : 0;
}

export function appendQuizAttempt(
  file: CourseScoreFile,
  quizId: string,
  attempt: QuizAttempt,
): CourseScoreFile {
  const prev = file.quizzes[quizId];
  const attempts = [...(prev?.attempts ?? []), attempt];
  return {
    ...file,
    version: SCORE_FILE_VERSION,
    updatedAt: new Date().toISOString(),
    quizzes: {
      ...file.quizzes,
      [quizId]: {
        quizId,
        bestScore: Math.max(prev?.bestScore ?? 0, attempt.score),
        bestTotal: attempt.total,
        attempts,
      },
    },
  };
}

export function setProjectStatusInFile(
  file: CourseScoreFile,
  projectId: string,
  status: ProjectStatus,
): CourseScoreFile {
  return {
    ...file,
    version: SCORE_FILE_VERSION,
    updatedAt: new Date().toISOString(),
    projects: {
      ...file.projects,
      [projectId]: {
        projectId,
        status,
        points: projectPointsForStatus(status),
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function mergeScoreFileIntoQuizProgress(
  courseId: string,
  file: CourseScoreFile,
  byKey: Record<string, QuizProgress>,
): Record<string, QuizProgress> {
  const next = { ...byKey };

  for (const entry of Object.values(file.quizzes)) {
    const parts = entry.quizId.split("/");
    let moduleId: string | undefined;
    let lessonId: string | undefined;
    let quizId: string;
    if (parts.length >= 3) {
      moduleId = parts[0];
      lessonId = parts[1];
      quizId = parts.slice(2).join("/");
    } else if (parts.length === 2) {
      lessonId = parts[0];
      quizId = parts[1];
    } else {
      quizId = entry.quizId;
    }
    const key = quizProgressKey(courseId, quizId, lessonId, moduleId);
    const prev = next[key];
    const lastAttempt = entry.attempts[entry.attempts.length - 1];

    const shouldApply =
      !prev ||
      entry.bestScore > prev.bestScore ||
      (entry.bestScore === prev.bestScore && entry.attempts.length >= prev.attempts);

    if (shouldApply) {
      next[key] = {
        bestScore: entry.bestScore,
        bestTotal: entry.bestTotal,
        attempts: entry.attempts.length,
        ...(lastAttempt ? { lastAttempt } : {}),
      };
    }
  }

  return next;
}

export type ProjectProgress = {
  status: ProjectStatus;
  points: number;
  updatedAt?: string;
};

export function mergeScoreFileIntoProjectProgress(
  courseId: string,
  file: CourseScoreFile,
  byKey: Record<string, ProjectProgress>,
): Record<string, ProjectProgress> {
  const next = { ...byKey };

  for (const entry of Object.values(file.projects)) {
    const parts = entry.projectId.split("/");
    let moduleId: string | undefined;
    let lessonId: string | undefined;
    let projectId: string;
    if (parts.length >= 3) {
      moduleId = parts[0];
      lessonId = parts[1];
      projectId = parts.slice(2).join("/");
    } else if (parts.length === 2) {
      lessonId = parts[0];
      projectId = parts[1];
    } else {
      projectId = entry.projectId;
    }
    const key = projectProgressKey(courseId, projectId, lessonId, moduleId);
    const prev = next[key];
    if (!prev || entry.updatedAt >= (prev.updatedAt ?? "")) {
      next[key] = {
        status: entry.status,
        points: entry.points,
        updatedAt: entry.updatedAt,
      };
    }
  }

  return next;
}

export function computeCoursePoints(input: {
  quizBestScores: number[];
  projectStatuses: ProjectStatus[];
}): CoursePoints {
  const quizPoints = input.quizBestScores.reduce((sum, score) => sum + score, 0);
  const projectPoints = input.projectStatuses.reduce(
    (sum, status) => sum + projectPointsForStatus(status),
    0,
  );
  return { quizPoints, projectPoints, totalPoints: quizPoints + projectPoints };
}

export type CoursePoints = {
  quizPoints: number;
  projectPoints: number;
  totalPoints: number;
};

export type CoursePointsWithMax = CoursePoints & {
  quizMax: number;
  projectMax: number;
  totalMax: number;
};

export function computeCourseMaxPoints(course: Course): Omit<CoursePointsWithMax, keyof CoursePoints> {
  const quizMax = course.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const projectMax = course.projects.length * PROJECT_POINTS_WEIGHT;
  return { quizMax, projectMax, totalMax: quizMax + projectMax };
}

export function computeCourseMaxPointsFromItems(
  quizzes: Array<{ questions: unknown[] }>,
  projectCount: number,
): Omit<CoursePointsWithMax, keyof CoursePoints> {
  const quizMax = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  const projectMax = projectCount * PROJECT_POINTS_WEIGHT;
  return { quizMax, projectMax, totalMax: quizMax + projectMax };
}

export function withCourseMaxPoints(course: Course, points: CoursePoints): CoursePointsWithMax {
  return { ...points, ...computeCourseMaxPoints(course) };
}

export function withCourseMaxPointsFromItems(
  quizzes: Array<{ questions: unknown[] }>,
  projectCount: number,
  points: CoursePoints,
): CoursePointsWithMax {
  return { ...points, ...computeCourseMaxPointsFromItems(quizzes, projectCount) };
}

