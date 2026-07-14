import { useMemo } from "react";
import { buildLearnerActivityMetrics } from "../../domain/learnerActivity";
import type { Course } from "../../domain/types/catalog";
import type { QuizProgress } from "../../domain/types/quiz";
import type { ProjectProgress } from "../../domain/types/quizScore";
import { listPendingProjects, type PendingProjectRow } from "../selectors/learnerDashboard";
import { useCourseScoreHistoryStore } from "../stores/courseScoreHistoryStore";
import { useProjectProgressStore } from "../stores/projectProgressStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export type LearnerDashboardData = {
  streak: number;
  weeks: Array<{ weekStart: string; points: number }>;
  averagePointsPerWeek: number;
  pendingProjects: PendingProjectRow[];
};

export function useLearnerDashboard(courses: Course[]): LearnerDashboardData {
  const historyByCourse = useCourseScoreHistoryStore((s) => s.byCourseId);
  const quizByKey = useQuizProgressStore((s) => s.byKey);
  const projectByKey = useProjectProgressStore((s) => s.byKey);

  return useMemo(() => {
    const scoreFiles = Object.values(historyByCourse);
    const fallbackQuizzes: QuizProgress[] = Object.values(quizByKey);
    const fallbackProjects: ProjectProgress[] = Object.values(projectByKey);
    const extraActivityTimestamps = fallbackProjects
      .map((p) => p.updatedAt)
      .filter((at): at is string => Boolean(at));

    const metrics = buildLearnerActivityMetrics({
      scoreFiles,
      fallbackQuizzes,
      fallbackProjects,
      extraActivityTimestamps,
    });

    return {
      streak: metrics.streak,
      weeks: metrics.weeks,
      averagePointsPerWeek: metrics.averagePointsPerWeek,
      pendingProjects: listPendingProjects(courses, projectByKey, 5),
    };
  }, [courses, historyByCourse, projectByKey, quizByKey]);
}
