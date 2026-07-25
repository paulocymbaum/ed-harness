import type { Module } from "../../domain/types/catalog";
import { lookupQuizProgressEntry } from "../../domain/types/quiz";
import { lookupProjectProgressEntry } from "../../domain/types/quizScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export function useModuleCompletion(courseId: string, module: Module) {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  const quizItems = module.quizzes.map((quiz) =>
    Boolean(
      lookupQuizProgressEntry(
        quizByKey,
        courseId,
        quiz.id,
        quiz.lessonId,
        quiz.moduleId,
      )?.bestScore,
    ),
  );
  const projectItems = module.projects.map((project) => {
    const status = lookupProjectProgressEntry(
      projectByKey,
      courseId,
      project.id,
      project.lessonId,
      project.moduleId,
    )?.status;
    return status === "done";
  });

  const items = [...quizItems, ...projectItems];
  const done = items.filter(Boolean).length;
  const total = items.length;

  return { done, total, hasProgress: done > 0 && total > 0 };
}
