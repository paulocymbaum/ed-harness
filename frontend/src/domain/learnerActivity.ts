import type { QuizProgress } from "./types/quiz";
import type { CourseScoreFile, ProjectProgress } from "./types/quizScore";
import { PROJECT_POINTS_WEIGHT } from "./types/quizScore";

export type ActivityPointEvent = {
  at: string;
  points: number;
};

export type WeeklyPointsBucket = {
  /** Local Monday YYYY-MM-DD for the week start */
  weekStart: string;
  points: number;
};

export type WeeklyPointsSummary = {
  weeks: WeeklyPointsBucket[];
  averagePointsPerWeek: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar day key YYYY-MM-DD */
export function toLocalDayKey(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfLocalWeek(date: Date): Date {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = local.getDay(); // 0 Sun … 6 Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  local.setDate(local.getDate() + mondayOffset);
  local.setHours(0, 0, 0, 0);
  return local;
}

export function addLocalDays(dayKey: string, delta: number): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(y, m - 1, d + delta);
  return toLocalDayKey(date);
}

/** Quiz deltas from full attempt history (best-score improvements only). */
export function eventsFromQuizAttempts(attempts: Array<{ score: number; completedAt: string }>): ActivityPointEvent[] {
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );
  const events: ActivityPointEvent[] = [];
  let best = 0;
  for (const attempt of sorted) {
    if (attempt.score > best) {
      events.push({ at: attempt.completedAt, points: attempt.score - best });
      best = attempt.score;
    }
  }
  return events;
}

export function eventsFromCourseScoreFile(file: CourseScoreFile): ActivityPointEvent[] {
  const events: ActivityPointEvent[] = [];

  for (const entry of Object.values(file.quizzes)) {
    events.push(...eventsFromQuizAttempts(entry.attempts));
  }

  for (const entry of Object.values(file.projects)) {
    if (entry.status === "done" && entry.points > 0) {
      events.push({ at: entry.updatedAt, points: entry.points });
    }
  }

  return events;
}

/**
 * Fallback when no score.json history is cached: attribute current best quiz
 * points to lastAttempt, and project points to updatedAt when done.
 */
export function eventsFromProgressFallback(input: {
  quizzes: QuizProgress[];
  projects: ProjectProgress[];
}): ActivityPointEvent[] {
  const events: ActivityPointEvent[] = [];

  for (const quiz of input.quizzes) {
    if (quiz.bestScore > 0 && quiz.lastAttempt?.completedAt) {
      events.push({ at: quiz.lastAttempt.completedAt, points: quiz.bestScore });
    }
  }

  for (const project of input.projects) {
    if (project.status === "done") {
      const points = project.points > 0 ? project.points : PROJECT_POINTS_WEIGHT;
      if (project.updatedAt) {
        events.push({ at: project.updatedAt, points });
      }
    }
  }

  return events;
}

/** Activity day keys from point events plus non-scoring project touches. */
export function collectActiveDayKeys(
  events: ActivityPointEvent[],
  extraTimestamps: string[] = [],
): Set<string> {
  const days = new Set<string>();
  for (const event of events) {
    const key = toLocalDayKey(event.at);
    if (key) days.add(key);
  }
  for (const at of extraTimestamps) {
    const key = toLocalDayKey(at);
    if (key) days.add(key);
  }
  return days;
}

/**
 * Consecutive local days with activity, ending today.
 * Grace: if today has no activity but yesterday does, count from yesterday.
 */
export function computeStreak(activeDates: Set<string>, today: Date = new Date()): number {
  const todayKey = toLocalDayKey(today);
  if (!todayKey) return 0;

  let cursor = todayKey;
  if (!activeDates.has(todayKey)) {
    const yesterday = addLocalDays(todayKey, -1);
    if (!activeDates.has(yesterday)) return 0;
    cursor = yesterday;
  }

  let streak = 0;
  while (activeDates.has(cursor)) {
    streak += 1;
    cursor = addLocalDays(cursor, -1);
  }
  return streak;
}

export function computeWeeklyPoints(
  events: ActivityPointEvent[],
  weekCount = 4,
  now: Date = new Date(),
): WeeklyPointsSummary {
  const weeks: WeeklyPointsBucket[] = [];
  const latestWeekStart = startOfLocalWeek(now);

  for (let i = weekCount - 1; i >= 0; i -= 1) {
    const weekStart = new Date(latestWeekStart.getTime() - i * 7 * DAY_MS);
    weeks.push({ weekStart: toLocalDayKey(weekStart), points: 0 });
  }

  const indexByWeek = new Map(weeks.map((w, i) => [w.weekStart, i]));
  const windowStartMs = latestWeekStart.getTime() - (weekCount - 1) * 7 * DAY_MS;
  const windowEndMs = latestWeekStart.getTime() + 7 * DAY_MS;

  for (const event of events) {
    const at = new Date(event.at);
    if (Number.isNaN(at.getTime())) continue;
    const atMs = at.getTime();
    if (atMs < windowStartMs || atMs >= windowEndMs) continue;
    const weekKey = toLocalDayKey(startOfLocalWeek(at));
    const index = indexByWeek.get(weekKey);
    if (index === undefined) continue;
    weeks[index].points += event.points;
  }

  const total = weeks.reduce((sum, w) => sum + w.points, 0);
  const averagePointsPerWeek = weekCount > 0 ? total / weekCount : 0;

  return { weeks, averagePointsPerWeek };
}

export function buildLearnerActivityMetrics(input: {
  scoreFiles: CourseScoreFile[];
  fallbackQuizzes?: QuizProgress[];
  fallbackProjects?: ProjectProgress[];
  extraActivityTimestamps?: string[];
  now?: Date;
  weekCount?: number;
}): {
  streak: number;
  weeks: WeeklyPointsBucket[];
  averagePointsPerWeek: number;
} {
  const now = input.now ?? new Date();
  const weekCount = input.weekCount ?? 4;

  const events: ActivityPointEvent[] = [];
  if (input.scoreFiles.length > 0) {
    for (const file of input.scoreFiles) {
      events.push(...eventsFromCourseScoreFile(file));
    }
  } else {
    events.push(
      ...eventsFromProgressFallback({
        quizzes: input.fallbackQuizzes ?? [],
        projects: input.fallbackProjects ?? [],
      }),
    );
  }

  // Activity days: scoring events + project touches (doing/pending updates)
  const activeDates = collectActiveDayKeys(events, input.extraActivityTimestamps ?? []);

  // Also count non-point quiz attempts as streak days from fallback lastAttempts
  // when score files exist, attempt dates are already in events for improvements only —
  // include all attempt completedAt from score files for streak.
  if (input.scoreFiles.length > 0) {
    for (const file of input.scoreFiles) {
      for (const entry of Object.values(file.quizzes)) {
        for (const attempt of entry.attempts) {
          const key = toLocalDayKey(attempt.completedAt);
          if (key) activeDates.add(key);
        }
      }
      for (const entry of Object.values(file.projects)) {
        const key = toLocalDayKey(entry.updatedAt);
        if (key) activeDates.add(key);
      }
    }
  } else {
    for (const quiz of input.fallbackQuizzes ?? []) {
      if (quiz.lastAttempt?.completedAt) {
        const key = toLocalDayKey(quiz.lastAttempt.completedAt);
        if (key) activeDates.add(key);
      }
    }
  }

  const weekly = computeWeeklyPoints(events, weekCount, now);

  return {
    streak: computeStreak(activeDates, now),
    weeks: weekly.weeks,
    averagePointsPerWeek: weekly.averagePointsPerWeek,
  };
}
