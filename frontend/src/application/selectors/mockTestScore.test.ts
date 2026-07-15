import { describe, expect, it } from "vitest";
import { quizProgressKey } from "../../domain/types/quiz";
import { projectProgressKey } from "../../domain/types/quizScore";
import type { MockTestModule } from "../../domain/types/mockTest";
import { computeMockTestFinalScore } from "./mockTestScore";

const fundamentalsMock = {
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
      moduleId: "01-javascript-fundamentals-mock",
      questions: [{ id: "q1" }, { id: "q2" }],
    },
  ],
  projects: [
    {
      id: "001-clamp-utility",
      lessonId: "01.3-coding-challenge",
      moduleId: "01-javascript-fundamentals-mock",
    },
  ],
} as unknown as MockTestModule;

const objectsMock = {
  ...fundamentalsMock,
  id: "02-objects-references-and-copying-mock",
  quizzes: [
    {
      id: "quiz",
      lessonId: "01.2-multiple-choice",
      moduleId: "02-objects-references-and-copying-mock",
      questions: [{ id: "q1" }, { id: "q2" }, { id: "q3" }],
    },
  ],
  projects: [
    {
      id: "001-shallow-merge-guard",
      lessonId: "01.3-coding-challenge",
      moduleId: "02-objects-references-and-copying-mock",
    },
  ],
} as unknown as MockTestModule;

describe("computeMockTestFinalScore", () => {
  it("returns null when no quiz or coding progress exists", () => {
    expect(
      computeMockTestFinalScore({
        courseId: "javascript",
        mockTest: fundamentalsMock,
        quizByKey: {},
        deliveriesByKey: {},
      }),
    ).toBeNull();
  });

  it("averages quiz and coding section scores", () => {
    const score = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: fundamentalsMock,
      quizByKey: {
        [quizProgressKey(
          "javascript",
          "quiz",
          "01.2-multiple-choice",
          "01-javascript-fundamentals-mock",
        )]: {
          bestScore: 1,
          bestTotal: 2,
        },
      },
      deliveriesByKey: {
        [projectProgressKey(
          "javascript",
          "001-clamp-utility",
          "01.3-coding-challenge",
          "01-javascript-fundamentals-mock",
        )]: [
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

  it("does not mix quiz scores across mock tests that share lessonId", () => {
    const quizByKey = {
      [quizProgressKey(
        "javascript",
        "quiz",
        "01.2-multiple-choice",
        "01-javascript-fundamentals-mock",
      )]: {
        bestScore: 2,
        bestTotal: 2,
      },
      // Shared/`_` keys must not leak into other mocks
      [quizProgressKey("javascript", "quiz", "01.2-multiple-choice")]: {
        bestScore: 1,
        bestTotal: 2,
      },
      "javascript:quiz:01.2-multiple-choice:quiz": {
        bestScore: 1,
        bestTotal: 2,
      },
    };

    const fundamentals = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: fundamentalsMock,
      quizByKey,
      deliveriesByKey: {},
    });
    const objects = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: objectsMock,
      quizByKey,
      deliveriesByKey: {},
    });

    expect(fundamentals?.quizPercent).toBe(100);
    expect(objects).toBeNull();
  });

  it("uses only quiz score when coding has no review", () => {
    const score = computeMockTestFinalScore({
      courseId: "javascript",
      mockTest: fundamentalsMock,
      quizByKey: {
        [quizProgressKey(
          "javascript",
          "quiz",
          "01.2-multiple-choice",
          "01-javascript-fundamentals-mock",
        )]: {
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
      mockTest: fundamentalsMock,
      quizByKey: {},
      deliveriesByKey: {
        [projectProgressKey(
          "javascript",
          "001-clamp-utility",
          "01.3-coding-challenge",
          "01-javascript-fundamentals-mock",
        )]: [
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
