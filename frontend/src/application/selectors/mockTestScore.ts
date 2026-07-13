import { computeProgressPercent } from "../../domain/scoreProgress";
import type { ProjectDeliveryEntry } from "../../domain/types/projectDelivery";
import { quizProgressKey } from "../../domain/types/quiz";
import { projectProgressKey } from "../../domain/types/quizScore";
import type { MockTestModule } from "../../domain/types/mockTest";
import { getMockTestProject, getMockTestQuiz } from "./mockTestSelectors";

export type MockTestFinalScore = {
  percent: number;
  passed: boolean;
  quizPercent: number | null;
  codingPercent: number | null;
};

type QuizProgressEntry = { bestScore?: number; bestTotal?: number } | undefined;

export function computeMockTestFinalScore(input: {
  mockTest: MockTestModule;
  courseId: string;
  quizByKey: Record<string, QuizProgressEntry>;
  deliveriesByKey: Record<string, ProjectDeliveryEntry[] | undefined>;
}): MockTestFinalScore | null {
  const quizSection = input.mockTest.mockTest.sections.find((section) => section.type === "quiz");
  const codingSection = input.mockTest.mockTest.sections.find((section) => section.type === "coding");

  let quizPercent: number | null = null;
  let codingPercent: number | null = null;

  if (quizSection) {
    const quiz = getMockTestQuiz(input.mockTest, quizSection.lessonId);
    if (quiz) {
      const progress = input.quizByKey[
        quizProgressKey(input.courseId, quiz.id, quizSection.lessonId)
      ];
      const bestScore = progress?.bestScore ?? 0;
      const bestTotal = progress?.bestTotal ?? quiz.questions.length;
      if (bestTotal > 0 && bestScore > 0) {
        quizPercent = computeProgressPercent(bestScore, bestTotal);
      }
    }
  }

  if (codingSection) {
    const project = getMockTestProject(input.mockTest, codingSection.lessonId);
    if (project) {
      const deliveries =
        input.deliveriesByKey[
          projectProgressKey(input.courseId, project.id, codingSection.lessonId)
        ] ?? [];
      const lastReview = deliveries[deliveries.length - 1]?.review;
      if (lastReview) {
        codingPercent = Math.min(100, Math.max(0, Math.round(lastReview.score)));
      }
    }
  }

  const parts = [quizPercent, codingPercent].filter((value): value is number => value !== null);
  if (parts.length === 0) return null;

  const percent = Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length);
  const passed = percent >= input.mockTest.mockTest.passingScorePercent;

  return { percent, passed, quizPercent, codingPercent };
}
