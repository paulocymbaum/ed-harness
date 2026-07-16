import { describe, it } from "node:test";
import assert from "node:assert/strict";

function caminhoLicao(courseId, moduleId, lessonId) {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}`;
}

function caminhoQuizLicao(courseId, moduleId, lessonId, quizId) {
  return `${caminhoLicao(courseId, moduleId, lessonId)}/quiz/${encodeURIComponent(quizId)}`;
}

function caminhoProjetoLicao(courseId, moduleId, lessonId, projectId) {
  return `${caminhoLicao(courseId, moduleId, lessonId)}/project/${encodeURIComponent(projectId)}`;
}

function redirecionarDrawerLegado({
  courseId,
  moduleId,
  lessonId,
  drawerMode,
  activeQuizId,
  activeProjectId,
  quizExists,
  projectExists,
}) {
  if (drawerMode === "quiz") {
    if (activeQuizId && quizExists) {
      return caminhoQuizLicao(courseId, moduleId, lessonId, activeQuizId);
    }
    return caminhoLicao(courseId, moduleId, lessonId);
  }

  if (drawerMode === "project") {
    if (activeProjectId && projectExists) {
      return caminhoProjetoLicao(courseId, moduleId, lessonId, activeProjectId);
    }
    return caminhoLicao(courseId, moduleId, lessonId);
  }

  return null;
}

describe("lesson focus route paths", () => {
  it("builds canonical quiz path", () => {
    assert.equal(
      caminhoQuizLicao(
        "javascript",
        "01-javascript-fundamentals",
        "01.8.1-truthy-vs-falsy",
        "quiz-truthy-falsy",
      ),
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/quiz/quiz-truthy-falsy",
    );
  });

  it("builds canonical project path", () => {
    assert.equal(
      caminhoProjetoLicao(
        "javascript",
        "01-javascript-fundamentals",
        "01.8.1-truthy-vs-falsy",
        "001-cli-input-validator",
      ),
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/project/001-cli-input-validator",
    );
  });

  it("redirects legacy quiz drawer to focus route", () => {
    const destino = redirecionarDrawerLegado({
      courseId: "javascript",
      moduleId: "01-javascript-fundamentals",
      lessonId: "01.8.1-truthy-vs-falsy",
      drawerMode: "quiz",
      activeQuizId: "quiz-truthy-falsy",
      activeProjectId: null,
      quizExists: true,
      projectExists: false,
    });
    assert.equal(
      destino,
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/quiz/quiz-truthy-falsy",
    );
  });

  it("redirects invalid legacy project drawer back to lesson", () => {
    const destino = redirecionarDrawerLegado({
      courseId: "javascript",
      moduleId: "01-javascript-fundamentals",
      lessonId: "01.8.1-truthy-vs-falsy",
      drawerMode: "project",
      activeQuizId: null,
      activeProjectId: "missing-project",
      quizExists: false,
      projectExists: false,
    });
    assert.equal(
      destino,
      "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy",
    );
  });
});
