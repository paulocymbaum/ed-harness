import { useMemo } from "react";
import type { Course, Lesson } from "../../domain/types/catalog";
import {
  computeLessonScore,
  mergeNodeScores,
  type NodeScore,
} from "../selectors/contentGraphScore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

/** Roll up aggregated scores for all lessons in a contents-drawer section. */
export function useSectionScore(input: {
  course: Course;
  moduleId: string;
  lessons: Lesson[];
}): NodeScore | null {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    const scores = input.lessons.map((lesson) =>
      computeLessonScore({
        course: input.course,
        moduleId: input.moduleId,
        lessonId: lesson.id,
        progress: { quizByKey, projectByKey },
      }),
    );
    return mergeNodeScores(scores);
  }, [input.course, input.moduleId, input.lessons, quizByKey, projectByKey]);
}
