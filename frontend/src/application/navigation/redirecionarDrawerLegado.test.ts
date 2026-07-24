import { describe, expect, it } from "vitest";
import { redirecionarDrawerLegado } from "./redirecionarDrawerLegado";

describe("redirecionarDrawerLegado", () => {
  it("redirects valid quiz drawer to focus route", () => {
    expect(
      redirecionarDrawerLegado({
        courseId: "javascript",
        moduleId: "01-fundamentals",
        lessonId: "01.1.1-lesson",
        drawerMode: "quiz",
        activeQuizId: "quiz-1",
        activeProjectId: null,
        quizExists: true,
        projectExists: false,
      }),
    ).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson/quiz/quiz-1",
    );
  });

  it("redirects valid project drawer to focus route", () => {
    expect(
      redirecionarDrawerLegado({
        courseId: "javascript",
        moduleId: "01-fundamentals",
        lessonId: "01.1.1-lesson",
        drawerMode: "project",
        activeQuizId: null,
        activeProjectId: "proj-1",
        quizExists: false,
        projectExists: true,
      }),
    ).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson/project/proj-1",
    );
  });

  it("clears invalid quiz drawer back to lesson", () => {
    expect(
      redirecionarDrawerLegado({
        courseId: "javascript",
        moduleId: "01-fundamentals",
        lessonId: "01.1.1-lesson",
        drawerMode: "quiz",
        activeQuizId: "missing",
        activeProjectId: null,
        quizExists: false,
        projectExists: false,
      }),
    ).toBe("/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson");
  });

  it("returns null when no drawer mode", () => {
    expect(
      redirecionarDrawerLegado({
        courseId: "javascript",
        moduleId: "01-fundamentals",
        lessonId: "01.1.1-lesson",
        drawerMode: null,
        activeQuizId: null,
        activeProjectId: null,
        quizExists: false,
        projectExists: false,
      }),
    ).toBeNull();
  });
});
