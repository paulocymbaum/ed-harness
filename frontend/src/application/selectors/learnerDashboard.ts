import type { Course } from "../../domain/types/catalog";
import type { ProjectProgress, ProjectStatus } from "../../domain/types/quizScore";
import { projectProgressKey } from "../../domain/types/quizScore";
import { getAllProjectsForCourse } from "./catalogSelectors";

export type PendingProjectRow = {
  courseId: string;
  courseTitle: string;
  projectId: string;
  title: string;
  moduleId?: string;
  lessonId?: string;
  status: Exclude<ProjectStatus, "done">;
  updatedAt?: string;
};

type PendingProjectSortRow = PendingProjectRow & { catalogIndex: number };

const STATUS_RANK: Record<Exclude<ProjectStatus, "done">, number> = {
  doing: 0,
  pending: 1,
};

export function listPendingProjects(
  courses: Course[],
  projectByKey: Record<string, ProjectProgress>,
  limit = 5,
): PendingProjectRow[] {
  const rows: PendingProjectSortRow[] = [];

  for (const course of courses) {
    const projects = getAllProjectsForCourse(course);
    projects.forEach((project, catalogIndex) => {
      const key = projectProgressKey(course.id, project.id, project.lessonId);
      const progress = projectByKey[key];
      const status = progress?.status ?? "pending";
      if (status === "done") return;

      rows.push({
        courseId: course.id,
        courseTitle: course.title,
        projectId: project.id,
        title: project.title,
        moduleId: project.moduleId,
        lessonId: project.lessonId,
        status,
        updatedAt: progress?.updatedAt,
        catalogIndex,
      });
    });
  }

  rows.sort((a, b) => {
    const rankDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (rankDiff !== 0) return rankDiff;

    const aUpdated = a.updatedAt ?? "";
    const bUpdated = b.updatedAt ?? "";
    if (aUpdated !== bUpdated) return bUpdated.localeCompare(aUpdated);

    if (a.catalogIndex !== b.catalogIndex) return a.catalogIndex - b.catalogIndex;
    return a.title.localeCompare(b.title);
  });

  return rows.slice(0, limit).map(({ catalogIndex: _, ...row }) => row);
}
