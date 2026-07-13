import { describe, expect, it } from "vitest";
import { quizProgressKey } from "../../domain/types/quiz";
import { projectProgressKey } from "../../domain/types/quizScore";
import type { MockTestModule } from "../../domain/types/mockTest";
import { computeMockTestFinalScore } from "./mockTestScore";

const baseMockTest = {
  id: "01-javascript-fundamentals-mock",
  mockTest: {
    passingScorePercent: 70,
    sections: [
      { lessonId: "01.1-test-instructions", type: "instructions" },
      { lessonId: "01.2-multiple-choice", type: "quiz" },
      { lessonId: "01.3-coding-challenge", type: "coding" },
    ],
  },
  quizzes: [
    {
      id: "quiz",
      lessonId: "01.2-multiple-choice",
      questions: [{ id: "q1" }, { id: "q2" }],
    },
  ],
  projects: [
    {
      id: "001-clamp-utility",
      lessonId: "01.3-coding-challenge",
    },
  ],
} as unknown as MockTestModule;

describe("computeMockTestFinalScore", () => {
  it("returns null when no quiz or coding progress exists", () => {
    expect(
      computeMockTestFinalScore({
        courseId: "javascript",
        mockTest: baseMockTest,
        quizByKey: {},
        deliveriesByKey: {},
      }),
    ).toBeNull();
  });

  it("averages quiz and coding section scores", () => {
    const score = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: baseMockTest,
      quizByKey: {
        [quizProgressKey("javascript", "quiz", "01.2-multiple-choice")]: {
          bestScore: 1,
          bestTotal: 2,
        },
      },
      deliveriesByKey: {
        [projectProgressKey("javascript", "001-clamp-utility", "01.3-coding-challenge")]: [
          {
            id: "1",
            content: "code",
            submittedAt: "2026-01-01",
            review: { score: 100, comment: "ok", reviewedAt: "2026-01-01" },
          },
        ],
      },
    });

    expect(score).toEqual({
      percent: 75,
      passed: true,
      quizPercent: 50,
      codingPercent: 100,
    });
  });

  it("uses only quiz score when coding has no review", () => {
    const score = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: baseMockTest,
      quizByKey: {
        [quizProgressKey("javascript", "quiz", "01.2-multiple-choice")]: {
          bestScore: 2,
          bestTotal: 2,
        },
      },
      deliveriesByKey: {},
    });

    expect(score).toEqual({
      percent: 100,
      passed: true,
      quizPercent: 100,
      codingPercent: null,
    });
  });

  it("marks fail when below passing threshold", () => {
    const score = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: baseMockTest,
      quizByKey: {},
      deliveriesByKey: {
        [projectProgressKey("javascript", "001-clamp-utility", "01.3-coding-challenge")]: [
          {
            id: "1",
            content: "code",
            submittedAt: "2026-01-01",
            review: { score: 60, comment: "gap", reviewedAt: "2026-01-01" },
          },
        ],
      },
    });

    expect(score?.percent).toBe(60);
    expect(score?.passed).toBe(false);
  });
});
