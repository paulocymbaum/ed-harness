import type { Catalog } from "../../domain/types/catalog";
import {
  legacyProjectProgressKey,
  legacyProjectProgressKeyWithLesson,
  legacyQuizProgressKey,
  projectProgressKey,
} from "../../domain/types/quizScore";
import {
  legacyQuizProgressKeyWithLesson,
  lookupQuizProgressEntry,
  quizProgressKey,
} from "../../domain/types/quiz";
import { lookupProjectProgressEntry } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

const MIGRATION_FLAG = "score-migration-v2-moduleId";

const LEGACY_COURSE_TO_SLUG: Record<string, string> = {
  "01-javascript-fundamentals": "javascript",
  "02-objects-references-and-copying": "javascript",
  "03-asynchronous-javascript-runtime-model-event-loop": "javascript",
};

function buildProjectLessonMap(catalog: Catalog): Map<string, string> {
  const map = new Map<string, string>();
  for (const course of catalog.courses) {
    for (const project of course.projects) {
      if (project.lessonId) map.set(project.id, project.lessonId);
    }
    for (const mod of course.modules ?? []) {
      for (const project of mod.projects) {
        if (project.lessonId) map.set(project.id, project.lessonId);
      }
    }
    for (const mock of course.mockTests ?? []) {
      for (const project of mock.projects) {
        if (project.lessonId) map.set(project.id, project.lessonId);
      }
    }
  }
  return map;
}

function buildQuizLessonMap(catalog: Catalog): Map<string, string> {
  const map = new Map<string, string>();
  for (const course of catalog.courses) {
    for (const quiz of course.quizzes) {
      if (quiz.lessonId) map.set(quiz.id, quiz.lessonId);
    }
    for (const mod of course.modules ?? []) {
      for (const quiz of mod.quizzes) {
        if (quiz.lessonId) map.set(quiz.id, quiz.lessonId);
      }
    }
  }
  return map;
}

function remapQuizKeys(
  byKey: Record<string, unknown>,
  projectLessonMap: Map<string, string>,
  quizLessonMap: Map<string, string>,
): Record<string, unknown> {
  const next = { ...byKey };

  for (const [oldKey, value] of Object.entries(byKey)) {
    const colon = oldKey.indexOf(":");
    if (colon <= 0) continue;

    const coursePart = oldKey.slice(0, colon);
    const rest = oldKey.slice(colon + 1);

    if (rest.startsWith("quiz:") || rest.startsWith("project:")) continue;

    const targetCourse = LEGACY_COURSE_TO_SLUG[coursePart] ?? coursePart;
    const isProject = projectLessonMap.has(rest);
    const lessonId = isProject
      ? projectLessonMap.get(rest)
      : quizLessonMap.get(rest);

    const newKey = isProject
      ? projectProgressKey(targetCourse, rest, lessonId)
      : quizProgressKey(targetCourse, rest, lessonId);

    if (!(newKey in next)) next[newKey] = value;
    if (oldKey !== newKey) delete next[oldKey];
  }

  return next;
}

/** Remap `course:quiz:lesson:quizId` → `course:quiz:module:lesson:quizId` when unambiguous. */
function remapToModuleScopedKeys(
  byKey: Record<string, unknown>,
  catalog: Catalog,
  kind: "quiz" | "project",
): Record<string, unknown> {
  const next = { ...byKey };

  type Item = { id: string; lessonId?: string; moduleId?: string };
  const items: Item[] = [];
  for (const course of catalog.courses) {
    if (kind === "quiz") {
      for (const quiz of course.quizzes) items.push(quiz);
      for (const mod of course.modules ?? []) for (const q of mod.quizzes) items.push(q);
      for (const mock of course.mockTests ?? []) for (const q of mock.quizzes) items.push(q);
    } else {
      for (const project of course.projects) items.push(project);
      for (const mod of course.modules ?? []) for (const p of mod.projects) items.push(p);
      for (const mock of course.mockTests ?? []) for (const p of mock.projects) items.push(p);
    }
  }

  for (const [oldKey, value] of Object.entries(byKey)) {
    const parts = oldKey.split(":");
    if (parts.length !== 4 || parts[1] !== kind) continue;
    const [courseId, , lessonId, itemId] = parts;
    if (lessonId === "_") continue;

    const matches = items.filter((item) => item.id === itemId && item.lessonId === lessonId);
    // Ambiguous shared mock key — leave untouched (do not invent ownership)
    if (matches.length !== 1 || !matches[0].moduleId) continue;
    if (matches[0].moduleId.endsWith("-mock")) continue;

    const newKey =
      kind === "quiz"
        ? quizProgressKey(courseId, itemId, lessonId, matches[0].moduleId)
        : projectProgressKey(courseId, itemId, lessonId, matches[0].moduleId);

    if (!(newKey in next)) next[newKey] = value;
    if (oldKey !== newKey) delete next[oldKey];
  }

  return next;
}

export function migrateProgressKeysFromCatalog(catalog: Catalog): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(MIGRATION_FLAG) === "done") return;

  const projectLessonMap = buildProjectLessonMap(catalog);
  const quizLessonMap = buildQuizLessonMap(catalog);

  const quizState = useQuizProgressStore.getState();
  const projectState = useProjectProgressStore.getState();

  let quizKeys = remapQuizKeys(
    quizState.byKey as Record<string, unknown>,
    projectLessonMap,
    quizLessonMap,
  );
  quizKeys = remapToModuleScopedKeys(quizKeys, catalog, "quiz");

  let projectKeys = remapQuizKeys(
    projectState.byKey as Record<string, unknown>,
    projectLessonMap,
    quizLessonMap,
  );
  projectKeys = remapToModuleScopedKeys(projectKeys, catalog, "project");

  useQuizProgressStore.setState({
    byKey: quizKeys as typeof quizState.byKey,
  });

  useProjectProgressStore.setState({
    byKey: projectKeys as typeof projectState.byKey,
  });

  localStorage.setItem(MIGRATION_FLAG, "done");
}

/** Resolve progress with legacy key fallback */
export function resolveQuizProgressKey(
  courseId: string,
  quizId: string,
  lessonId?: string,
  byKey?: Record<string, unknown>,
  moduleId?: string,
): string {
  if (byKey) {
    const hit = lookupQuizProgressEntry(byKey, courseId, quizId, lessonId, moduleId);
    if (hit !== undefined) {
      const candidates = [
        quizProgressKey(courseId, quizId, lessonId, moduleId),
        quizProgressKey(courseId, quizId, lessonId),
      ];
      if (!moduleId?.endsWith("-mock")) {
        candidates.push(legacyQuizProgressKeyWithLesson(courseId, quizId, lessonId));
        candidates.push(legacyQuizProgressKey(courseId, quizId));
      }
      for (const key of candidates) {
        if (byKey[key] !== undefined) return key;
      }
    }
  }
  return quizProgressKey(courseId, quizId, lessonId, moduleId);
}

export function resolveProjectProgressKey(
  courseId: string,
  projectId: string,
  lessonId?: string,
  byKey?: Record<string, unknown>,
  moduleId?: string,
): string {
  if (byKey) {
    const hit = lookupProjectProgressEntry(byKey, courseId, projectId, lessonId, moduleId);
    if (hit !== undefined) {
      const candidates = [
        projectProgressKey(courseId, projectId, lessonId, moduleId),
        projectProgressKey(courseId, projectId, lessonId),
      ];
      if (!moduleId?.endsWith("-mock")) {
        candidates.push(legacyProjectProgressKeyWithLesson(courseId, projectId, lessonId));
        candidates.push(legacyProjectProgressKey(courseId, projectId));
      }
      for (const key of candidates) {
        if (byKey[key] !== undefined) return key;
      }
    }
  }
  return projectProgressKey(courseId, projectId, lessonId, moduleId);
}
