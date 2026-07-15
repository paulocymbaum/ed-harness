import { describe, expect, it } from "vitest";
import {
  computeCourseMaxPointsFromItems,
  mergeScoreFileIntoQuizProgress,
  type CourseScoreFile,
} from "./quizScore";
import { lookupQuizProgressEntry, quizProgressKey } from "./quiz";

describe("mergeScoreFileIntoQuizProgress", () => {
  const courseId = "javascript";

  const baseFile: CourseScoreFile = {
    version: 2,
    courseId,
    updatedAt: "2026-06-10T12:00:00.000Z",
    quizzes: {},
    projects: {},
  };

  it("applies server entry when local progress is missing", () => {
    const file: CourseScoreFile = {
      ...baseFile,
      quizzes: {
        "01.1.1-running-javascript-node-js/quiz": {
          quizId: "01.1.1-running-javascript-node-js/quiz",
          bestScore: 4,
          bestTotal: 5,
          attempts: [{ score: 4, total: 5, completedAt: "2026-06-10T12:00:00.000Z" }],
        },
      },
    };

    const merged = mergeScoreFileIntoQuizProgress(courseId, file, {});
    const key = quizProgressKey(courseId, "quiz", "01.1.1-running-javascript-node-js");

    expect(merged[key]).toEqual({
      bestScore: 4,
      bestTotal: 5,
      attempts: 1,
      lastAttempt: { score: 4, total: 5, completedAt: "2026-06-10T12:00:00.000Z" },
    });
  });

  it("prefers higher bestScore over more attempts with lower score", () => {
    const key = quizProgressKey(courseId, "quiz", "lesson-a");
    const file: CourseScoreFile = {
      ...baseFile,
      quizzes: {
        "lesson-a/quiz": {
          quizId: "lesson-a/quiz",
          bestScore: 5,
          bestTotal: 5,
          attempts: [{ score: 5, total: 5, completedAt: "2026-06-10T12:00:00.000Z" }],
        },
      },
    };

    const merged = mergeScoreFileIntoQuizProgress(courseId, file, {
      [key]: { bestScore: 3, bestTotal: 5, attempts: 4 },
    });

    expect(merged[key]?.bestScore).toBe(5);
    expect(merged[key]?.attempts).toBe(1);
  });

  it("keeps local progress when server bestScore is lower", () => {
    const key = quizProgressKey(courseId, "quiz", "lesson-a");
    const file: CourseScoreFile = {
      ...baseFile,
      quizzes: {
        "lesson-a/quiz": {
          quizId: "lesson-a/quiz",
          bestScore: 2,
          bestTotal: 5,
          attempts: [
            { score: 2, total: 5, completedAt: "2026-06-10T12:00:00.000Z" },
            { score: 1, total: 5, completedAt: "2026-06-10T11:00:00.000Z" },
          ],
        },
      },
    };

    const merged = mergeScoreFileIntoQuizProgress(courseId, file, {
      [key]: { bestScore: 4, bestTotal: 5, attempts: 1 },
    });

    expect(merged[key]?.bestScore).toBe(4);
  });

  it("reads study progress from hydrated `_` keys via lookup", () => {
    const file: CourseScoreFile = {
      ...baseFile,
      quizzes: {
        "01.1.1-running-javascript-node-js/quiz": {
          quizId: "01.1.1-running-javascript-node-js/quiz",
          bestScore: 4,
          bestTotal: 5,
          attempts: [{ score: 4, total: 5, completedAt: "2026-06-10T12:00:00.000Z" }],
        },
      },
    };

    const merged = mergeScoreFileIntoQuizProgress(courseId, file, {});
    const progress = lookupQuizProgressEntry(
      merged,
      courseId,
      "quiz",
      "01.1.1-running-javascript-node-js",
      "01-javascript-fundamentals",
    );
    expect(progress?.bestScore).toBe(4);
  });

  it("hydrates module-scoped mock quiz keys without colliding", () => {
    const file: CourseScoreFile = {
      ...baseFile,
      quizzes: {
        "01-javascript-fundamentals-mock/01.2-multiple-choice/quiz": {
          quizId: "01-javascript-fundamentals-mock/01.2-multiple-choice/quiz",
          bestScore: 8,
          bestTotal: 8,
          attempts: [{ score: 8, total: 8, completedAt: "2026-06-10T12:00:00.000Z" }],
        },
        "02-objects-references-and-copying-mock/01.2-multiple-choice/quiz": {
          quizId: "02-objects-references-and-copying-mock/01.2-multiple-choice/quiz",
          bestScore: 3,
          bestTotal: 7,
          attempts: [{ score: 3, total: 7, completedAt: "2026-06-10T12:00:00.000Z" }],
        },
      },
    };

    const merged = mergeScoreFileIntoQuizProgress(courseId, file, {});
    const fundamentals = quizProgressKey(
      courseId,
      "quiz",
      "01.2-multiple-choice",
      "01-javascript-fundamentals-mock",
    );
    const objects = quizProgressKey(
      courseId,
      "quiz",
      "01.2-multiple-choice",
      "02-objects-references-and-copying-mock",
    );

    expect(merged[fundamentals]?.bestScore).toBe(8);
    expect(merged[objects]?.bestScore).toBe(3);
    expect(
      lookupQuizProgressEntry(
        merged,
        courseId,
        "quiz",
        "01.2-multiple-choice",
        "02-objects-references-and-copying-mock",
      )?.bestScore,
    ).toBe(3);
    expect(
      lookupQuizProgressEntry(
        merged,
        courseId,
        "quiz",
        "01.2-multiple-choice",
        "03-asynchronous-javascript-mock",
      ),
    ).toBeUndefined();
  });
});

describe("computeCourseMaxPointsFromItems", () => {
  it("sums questions across all quizzes and projects", () => {
    const result = computeCourseMaxPointsFromItems(
      [{ questions: [1, 2, 3] }, { questions: [1, 2] }],
      2,
    );

    expect(result).toEqual({ quizMax: 5, projectMax: 8, totalMax: 13 });
  });
});
