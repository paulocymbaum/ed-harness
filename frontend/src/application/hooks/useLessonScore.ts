import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import {
  computeLessonScore,
  type NodeScore,
} from "../selectors/contentGraphScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

/** Reactive aggregated lesson score (quiz + project points). */
export function useLessonScore(input: {
  course: Course;
  moduleId: string;
  lessonId: string;
}): NodeScore {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(
    () =>
      computeLessonScore({
        course: input.course,
        moduleId: input.moduleId,
        lessonId: input.lessonId,
        progress: { quizByKey, projectByKey },
      }),
    [input.course, input.moduleId, input.lessonId, quizByKey, projectByKey],
  );
}
