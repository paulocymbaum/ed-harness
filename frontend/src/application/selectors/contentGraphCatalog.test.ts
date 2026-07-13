import { describe, expect, it } from "vitest";
import type { Course } from "../../domain/types/catalog";
import type { ContentGraphNode } from "../../domain/types/contentGraph";
import {
  buildCatalogLessonIndex,
  enrichContentGraphWithCatalog,
} from "./contentGraphCatalog";

const graphLesson: ContentGraphNode = {
  id: "lesson-1",
  graphIndex: "01.2.1",
  label: "let and const",
  kind: "lesson",
  children: [],
  status: "planned",
};

const mockCourses: Course[] = [
  {
    id: "javascript",
    title: "JavaScript",
    readmePath: "",
    readmeMarkdown: "",
    structure: "hierarchy",
    modules: [
      {
        id: "01-javascript-fundamentals",
        title: "Fundamentals",
        graphIndex: "01",
        readmePath: "",
        readmeMarkdown: "",
        lessons: [
          {
            id: "01.2.1-let-and-const",
            title: "let and const",
            path: "",
            markdown: "",
            graphIndex: "01.2.1",
          },
        ],
        projects: [],
        quizzes: [],
      },
    ],
    lessons: [],
    projects: [],
    quizzes: [],
  },
  {
    id: "course-b",
    title: "Course B",
    readmePath: "",
    readmeMarkdown: "",
    structure: "hierarchy",
    modules: [
      {
        id: "01-test",
        title: "Test",
        graphIndex: "01",
        readmePath: "",
        readmeMarkdown: "",
        lessons: [
          {
            id: "01.2.1-other",
            title: "Other",
            path: "",
            markdown: "",
            graphIndex: "01.2.1",
          },
        ],
        projects: [],
        quizzes: [],
      },
    ],
    lessons: [],
    projects: [],
    quizzes: [],
  },
];

describe("buildCatalogLessonIndex", () => {
  it("indexes only the requested course (no cross-course collision)", () => {
    const jsIndex = buildCatalogLessonIndex(mockCourses, "javascript");
    expect(jsIndex.get("01.2.1")).toEqual({
      courseId: "javascript",
      moduleId: "01-javascript-fundamentals",
      lessonId: "01.2.1-let-and-const",
    });

    const bIndex = buildCatalogLessonIndex(mockCourses, "course-b");
    expect(bIndex.get("01.2.1")).toEqual({
      courseId: "course-b",
      moduleId: "01-test",
      lessonId: "01.2.1-other",
    });
  });
});

describe("enrichContentGraphWithCatalog", () => {
  it("marks catalog lessons as exists and others as planned", () => {
    const index = buildCatalogLessonIndex(mockCourses, "javascript");
    const enriched = enrichContentGraphWithCatalog(graphLesson, index);
    expect(enriched.status).toBe("exists");
    expect(enriched.catalogRef?.lessonId).toBe("01.2.1-let-and-const");

    const missing = enrichContentGraphWithCatalog(
      { ...graphLesson, graphIndex: "99.9.9" },
      index,
    );
    expect(missing.status).toBe("planned");
    expect(missing.catalogRef).toBeUndefined();
  });
});
