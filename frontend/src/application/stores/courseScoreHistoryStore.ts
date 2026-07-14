import { create } from "zustand";
import type { CourseScoreFile } from "../../domain/types/quizScore";

type CourseScoreHistoryState = {
  byCourseId: Record<string, CourseScoreFile>;
  setFile: (courseId: string, file: CourseScoreFile) => void;
  getFile: (courseId: string) => CourseScoreFile | null;
};

export const useCourseScoreHistoryStore = create<CourseScoreHistoryState>((set, get) => ({
  byCourseId: {},
  setFile: (courseId, file) => {
    set((state) => ({
      byCourseId: {
        ...state.byCourseId,
        [courseId]: file,
      },
    }));
  },
  getFile: (courseId) => get().byCourseId[courseId] ?? null,
}));
