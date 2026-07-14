import { describe, expect, it } from "vitest";
import type { Course, Project } from "../../domain/types/catalog";
import { projectProgressKey } from "../../domain/types/quizScore";
import { listPendingProjects } from "./learnerDashboard";

function makeProject(partial: Partial<Project> & Pick<Project, "id" | "title">): Project {
  return {
    rootPath: `course/js/projects/${partial.id}`,
    readmePath: `course/js/projects/${partial.id}/README.md`,
    readmeMarkdown: "# x",
    entries: [],
    ...partial,
  };
}

function makeCourse(projects: Project[]): Course {
  return {
    id: "javascript",
    title: "JavaScript",
    readmePath: "course/javascript/README.md",
    readmeMarkdown: "# JS",
    structure: "legacy",
    lessons: [],
    projects,
    quizzes: [],
  };
}

describe("listPendingProjects", () => {
  it("filters out done, prefers doing, then updatedAt, then catalog order", () => {
    const projects = [
      makeProject({ id: "p1", title: "Alpha", lessonId: "l1" }),
      makeProject({ id: "p2", title: "Beta", lessonId: "l1" }),
      makeProject({ id: "p3", title: "Gamma", lessonId: "l1" }),
      makeProject({ id: "p4", title: "Delta", lessonId: "l1" }),
    ];
    const course = makeCourse(projects);
    const byKey = {
      [projectProgressKey("javascript", "p1", "l1")]: {
        status: "done" as const,
        points: 4,
        updatedAt: "2026-07-10T00:00:00.000Z",
      },
      [projectProgressKey("javascript", "p2", "l1")]: {
        status: "pending" as const,
        points: 0,
        updatedAt: "2026-07-12T00:00:00.000Z",
      },
      [projectProgressKey("javascript", "p3", "l1")]: {
        status: "doing" as const,
        points: 0,
        updatedAt: "2026-07-11T00:00:00.000Z",
      },
      [projectProgressKey("javascript", "p4", "l1")]: {
        status: "pending" as const,
        points: 0,
        updatedAt: "2026-07-13T00:00:00.000Z",
      },
    };

    const rows = listPendingProjects([course], byKey, 5);
    expect(rows.map((r) => r.projectId)).toEqual(["p3", "p4", "p2"]);
    expect(rows).toHaveLength(3);
  });

  it("caps results at the given limit", () => {
    const projects = Array.from({ length: 8 }, (_, i) =>
      makeProject({ id: `p${i}`, title: `P${i}`, lessonId: "l1" }),
    );
    const rows = listPendingProjects([makeCourse(projects)], {}, 5);
    expect(rows).toHaveLength(5);
  });
});
