import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectProgress, ProjectStatus, CourseScoreFile } from "../../domain/types/quizScore";
import {
  mergeScoreFileIntoProjectProgress,
  projectPointsForStatus,
  projectProgressKey,
} from "../../domain/types/quizScore";
import { persistProjectStatus } from "../usecases/courseScores";
import { resolveProjectProgressKey } from "../usecases/migrateProgressKeys";

type ProjectProgressState = {
  byKey: Record<string, ProjectProgress>;
  getStatus: (
    courseId: string,
    projectId: string,
    lessonId?: string,
    moduleId?: string,
  ) => ProjectStatus;
  getProgress: (
    courseId: string,
    projectId: string,
    lessonId?: string,
    moduleId?: string,
  ) => ProjectProgress | null;
  setStatus: (
    courseId: string,
    projectId: string,
    status: ProjectStatus,
    lessonId?: string,
    moduleId?: string,
  ) => void;
  markProjectDoing: (
    courseId: string,
    projectId: string,
    lessonId?: string,
    moduleId?: string,
  ) => void;
  markProjectDone: (
    courseId: string,
    projectId: string,
    lessonId?: string,
    moduleId?: string,
  ) => void;
  hydrateCourseScores: (courseId: string, file: CourseScoreFile) => void;
};

export const useProjectProgressStore = create<ProjectProgressState>()(
  persist(
    (set, get) => ({
      byKey: {},
      getStatus: (courseId, projectId, lessonId, moduleId) => {
        const key = resolveProjectProgressKey(
          courseId,
          projectId,
          lessonId,
          get().byKey,
          moduleId,
        );
        return get().byKey[key]?.status ?? "pending";
      },
      getProgress: (courseId, projectId, lessonId, moduleId) => {
        const key = resolveProjectProgressKey(
          courseId,
          projectId,
          lessonId,
          get().byKey,
          moduleId,
        );
        return get().byKey[key] ?? null;
      },
      setStatus: (courseId, projectId, status, lessonId, moduleId) => {
        const key = projectProgressKey(courseId, projectId, lessonId, moduleId);
        const updatedAt = new Date().toISOString();
        set((state) => ({
          byKey: {
            ...state.byKey,
            [key]: {
              status,
              points: projectPointsForStatus(status),
              updatedAt,
            },
          },
        }));
        void persistProjectStatus(courseId, projectId, status, lessonId, moduleId);
      },
      markProjectDoing: (courseId, projectId, lessonId, moduleId) => {
        const current = get().getStatus(courseId, projectId, lessonId, moduleId);
        if (current !== "pending") return;
        get().setStatus(courseId, projectId, "doing", lessonId, moduleId);
      },
      markProjectDone: (courseId, projectId, lessonId, moduleId) => {
        const current = get().getStatus(courseId, projectId, lessonId, moduleId);
        if (current === "done") return;
        get().setStatus(courseId, projectId, "done", lessonId, moduleId);
      },
      hydrateCourseScores: (courseId, file) => {
        set((state) => ({
          byKey: mergeScoreFileIntoProjectProgress(courseId, file, state.byKey),
        }));
      },
    }),
    { name: "ed-harness-project-progress" },
  ),
);
