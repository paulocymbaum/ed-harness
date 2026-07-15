import { useMemo } from "react";
import type { Course } from "../../domain/types/catalog";
import { lookupQuizProgressEntry } from "../../domain/types/quiz";
import {
  computeCoursePoints,
  lookupProjectProgressEntry,
  withCourseMaxPointsFromItems,
  type CoursePointsWithMax,
} from "../../domain/types/quizScore";
import {
  getAllProjectsForCourse,
  getAllQuizzesForCourse,
} from "../selectors/catalogSelectors";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export function useCoursePoints(courseId: string, course: Course): CoursePointsWithMax {
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    const quizzes = getAllQuizzesForCourse(course);
    const projects = getAllProjectsForCourse(course);

    const quizBestScores = quizzes.map(
      (quiz) =>
        lookupQuizProgressEntry(
          quizByKey,
          courseId,
          quiz.id,
          quiz.lessonId,
          quiz.moduleId,
        )?.bestScore ?? 0,
    );
    const projectStatuses = projects.map(
      (project) =>
        lookupProjectProgressEntry(
          projectByKey,
          courseId,
          project.id,
          project.lessonId,
          project.moduleId,
        )?.status ?? "pending",
    );
    return withCourseMaxPointsFromItems(
      quizzes,
      projects.length,
      computeCoursePoints({ quizBestScores, projectStatuses }),
    );
  }, [course, courseId, projectByKey, quizByKey]);
}
