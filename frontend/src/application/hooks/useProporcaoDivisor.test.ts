import { describe, expect, it } from "vitest";
import { calcularProporcaoDoPonteiro } from "./useProporcaoDivisor";

describe("calcularProporcaoDoPonteiro", () => {
  it("maps pointer position to left pane ratio", () => {
    const retangulo = { left: 100, width: 200 } as DOMRect;
    expect(calcularProporcaoDoPonteiro(100, retangulo)).toBe(0);
    expect(calcularProporcaoDoPonteiro(200, retangulo)).toBe(0.5);
    expect(calcularProporcaoDoPonteiro(300, retangulo)).toBe(1);
  });

  it("returns default when width is zero", () => {
    const retangulo = { left: 0, width: 0 } as DOMRect;
    expect(calcularProporcaoDoPonteiro(50, retangulo)).toBe(0.45);
  });
});
