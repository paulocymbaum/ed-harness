import { describe, expect, it, vi } from "vitest";
import { runProjectStarter } from "./runProjectStarter";
import { setProjectRunRepository } from "./projectRun";
import type { ProjectRunRepository } from "../../domain/repositories/projectRunRepository";

vi.mock("./runBrowserProjectMatrix", () => ({
  runBrowserProjectMatrix: vi.fn(async () => ({
    status: "ok",
    matrix: { passedCount: 1, failedCount: 0, totalCount: 1, cases: [] },
  })),
}));

describe("runProjectStarter fallback", () => {
  it("falls back to the browser runner when the HTTP API is unavailable", async () => {
    const repository: ProjectRunRepository = {
      async run() {
        return { status: "error", code: "unavailable" };
      },
    };
    setProjectRunRepository(repository);

    const outcome = await runProjectStarter({
      courseId: "javascript",
      rootPath: "course/javascript/x",
      draft: "process.stdout.write('ok\\n');",
      testCases: [{ id: "a", name: "A", stdin: "", expectedStdout: "ok\n" }],
    });

    expect(outcome).toEqual({
      status: "ok",
      matrix: { passedCount: 1, failedCount: 0, totalCount: 1, cases: [] },
    });
  });

  it("uses starterCode when the draft has no extractable source", async () => {
    const repository: ProjectRunRepository = {
      async run() {
        return null;
      },
    };
    setProjectRunRepository(repository);

    const { runBrowserProjectMatrix } = await import("./runBrowserProjectMatrix");
    await runProjectStarter({
      courseId: "javascript",
      rootPath: "course/javascript/x",
      draft: "Just notes, no code.",
      starterCode: "process.stdout.write('from-starter\\n');",
      testCases: [{ id: "a", name: "A", stdin: "" }],
    });

    expect(runBrowserProjectMatrix).toHaveBeenCalledWith({
      code: "process.stdout.write('from-starter\\n');",
      testCases: [{ id: "a", name: "A", stdin: "" }],
    });
  });
});
