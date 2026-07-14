import { describe, expect, it } from "vitest";
import {
  addLocalDays,
  buildLearnerActivityMetrics,
  computeStreak,
  computeWeeklyPoints,
  eventsFromQuizAttempts,
  toLocalDayKey,
} from "./learnerActivity";
import { emptyCourseScoreFile, PROJECT_POINTS_WEIGHT } from "./types/quizScore";

describe("eventsFromQuizAttempts", () => {
  it("emits deltas only when best score improves", () => {
    const events = eventsFromQuizAttempts([
      { score: 2, completedAt: "2026-07-01T10:00:00.000Z" },
      { score: 1, completedAt: "2026-07-02T10:00:00.000Z" },
      { score: 4, completedAt: "2026-07-03T10:00:00.000Z" },
    ]);
    expect(events).toEqual([
      { at: "2026-07-01T10:00:00.000Z", points: 2 },
      { at: "2026-07-03T10:00:00.000Z", points: 2 },
    ]);
  });
});

describe("computeStreak", () => {
  it("counts consecutive days ending today", () => {
    const today = new Date(2026, 6, 13); // Jul 13 local
    const todayKey = toLocalDayKey(today);
    const days = new Set([todayKey, addLocalDays(todayKey, -1), addLocalDays(todayKey, -2)]);
    expect(computeStreak(days, today)).toBe(3);
  });

  it("applies grace when today is empty but yesterday is active", () => {
    const today = new Date(2026, 6, 13);
    const todayKey = toLocalDayKey(today);
    const yesterday = addLocalDays(todayKey, -1);
    const days = new Set([yesterday, addLocalDays(yesterday, -1)]);
    expect(computeStreak(days, today)).toBe(2);
  });

  it("returns 0 when today and yesterday are inactive", () => {
    const today = new Date(2026, 6, 13);
    const todayKey = toLocalDayKey(today);
    const days = new Set([addLocalDays(todayKey, -3)]);
    expect(computeStreak(days, today)).toBe(0);
  });
});

describe("computeWeeklyPoints", () => {
  it("buckets points into the last N Monday-start weeks", () => {
    // Wednesday Jul 15, 2026 → week starts Mon Jul 13
    const now = new Date(2026, 6, 15, 12, 0, 0);
    const summary = computeWeeklyPoints(
      [
        { at: new Date(2026, 6, 14, 9, 0, 0).toISOString(), points: 3 },
        { at: new Date(2026, 6, 7, 9, 0, 0).toISOString(), points: 5 },
        { at: new Date(2026, 5, 20, 9, 0, 0).toISOString(), points: 99 }, // outside window
      ],
      4,
      now,
    );

    expect(summary.weeks).toHaveLength(4);
    expect(summary.weeks[3].points).toBe(3);
    expect(summary.weeks[2].points).toBe(5);
    expect(summary.weeks[0].points).toBe(0);
    expect(summary.weeks[1].points).toBe(0);
    expect(summary.averagePointsPerWeek).toBe((3 + 5) / 4);
  });
});

describe("buildLearnerActivityMetrics", () => {
  it("uses score file history for streak and weekly points", () => {
    const now = new Date(2026, 6, 13, 18, 0, 0); // Mon Jul 13
    const file = emptyCourseScoreFile("javascript");
    const todayIso = new Date(2026, 6, 13, 10, 0, 0).toISOString();
    const yesterdayIso = new Date(2026, 6, 12, 10, 0, 0).toISOString();

    file.quizzes["lesson/q1"] = {
      quizId: "lesson/q1",
      bestScore: 3,
      bestTotal: 5,
      attempts: [
        { score: 2, total: 5, completedAt: yesterdayIso },
        { score: 3, total: 5, completedAt: todayIso },
      ],
    };
    file.projects["lesson/p1"] = {
      projectId: "lesson/p1",
      status: "done",
      points: PROJECT_POINTS_WEIGHT,
      updatedAt: todayIso,
    };

    const metrics = buildLearnerActivityMetrics({ scoreFiles: [file], now, weekCount: 4 });

    expect(metrics.streak).toBe(2);
    expect(metrics.weeks[3].points).toBe(2 + 1 + PROJECT_POINTS_WEIGHT); // quiz deltas + project
    expect(metrics.averagePointsPerWeek).toBe((2 + 1 + PROJECT_POINTS_WEIGHT) / 4);
  });

  it("falls back to progress stores when no score files", () => {
    const now = new Date(2026, 6, 13, 18, 0, 0);
    const at = new Date(2026, 6, 13, 10, 0, 0).toISOString();

    const metrics = buildLearnerActivityMetrics({
      scoreFiles: [],
      fallbackQuizzes: [
        {
          bestScore: 4,
          bestTotal: 5,
          attempts: 1,
          lastAttempt: { score: 4, total: 5, completedAt: at },
        },
      ],
      fallbackProjects: [{ status: "done", points: 4, updatedAt: at }],
      now,
      weekCount: 4,
    });

    expect(metrics.streak).toBe(1);
    expect(metrics.weeks[3].points).toBe(8);
  });
});
