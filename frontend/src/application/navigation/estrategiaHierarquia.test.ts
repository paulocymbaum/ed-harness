import type { NavigateFunction } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { criarEstrategiaHierarquia } from "./estrategiaHierarquia";
import type { NavegacaoCursoDeps } from "./tiposNavegacaoCurso";

function criarDepsMock(): NavegacaoCursoDeps & { urls: string[] } {
  const urls: string[] = [];
  const navigate = ((to: string | { pathname?: string }) => {
    urls.push(typeof to === "string" ? to : (to.pathname ?? ""));
  }) as NavigateFunction;

  return {
    urls,
    navigate,
    searchParams: new URLSearchParams(),
    setSearchParams: vi.fn(),
    setCourseTab: vi.fn(),
  };
}

describe("criarEstrategiaHierarquia", () => {
  it("goLesson navigates to lesson path", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.goLesson("javascript", "01-fundamentals", "01.1.1-lesson");

    expect(deps.urls[0]).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson",
    );
  });

  it("abrirQuizLicao navigates to dedicated quiz path", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.abrirQuizLicao(
      "javascript",
      "01-fundamentals",
      "01.1.1-lesson",
      "quiz-id",
    );

    expect(deps.urls[0]).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson/quiz/quiz-id",
    );
  });

  it("abrirProjetoLicao navigates to dedicated project path", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.abrirProjetoLicao(
      "javascript",
      "01-fundamentals",
      "01.1.1-lesson",
      "001-project",
    );

    expect(deps.urls[0]).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson/project/001-project",
    );
  });

  it("voltarParaLicao returns to lesson path", () => {
    const deps = criarDepsMock();
    const strategy = criarEstrategiaHierarquia(deps);

    strategy.voltarParaLicao("javascript", "01-fundamentals", "01.1.1-lesson");

    expect(deps.urls[0]).toBe(
      "/course/javascript/module/01-fundamentals/lesson/01.1.1-lesson",
    );
  });
});
