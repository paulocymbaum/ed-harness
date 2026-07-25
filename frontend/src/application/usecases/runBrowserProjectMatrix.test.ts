import { describe, expect, it, vi } from "vitest";
import { runBrowserProjectMatrix } from "./runBrowserProjectMatrix";

vi.mock("../../infrastructure/project-run/runNodeLikeInBrowser", () => ({
  runNodeLikeInBrowser: vi.fn(async (_code: string, stdin: string) => {
    if (stdin.startsWith("60")) {
      return { stdout: "Pass:70\nPass:90\n", stderr: "", exitCode: 0, timedOut: false };
    }
    return { stdout: "Not implemented yet\n", stderr: "", exitCode: 0, timedOut: false };
  }),
}));

describe("runBrowserProjectMatrix", () => {
  it("builds a pass/fail matrix from browser run results", async () => {
    const outcome = await runBrowserProjectMatrix({
      code: "process.stdout.write('x')",
      testCases: [
        {
          id: "example",
          name: "Example",
          stdin: "60\n3\n40\n70\n90\n",
          expectedStdout: "Pass:70\nPass:90\n",
          expectedExitCode: 0,
        },
        {
          id: "other",
          name: "Other",
          stdin: "1\n",
          expectedStdout: "",
          expectedExitCode: 0,
        },
      ],
    });

    expect(outcome.status).toBe("ok");
    if (outcome.status !== "ok") return;
    expect(outcome.matrix.passedCount).toBe(1);
    expect(outcome.matrix.failedCount).toBe(1);
    expect(outcome.matrix.totalCount).toBe(2);
    expect(outcome.matrix.cases[0]?.status).toBe("passed");
    expect(outcome.matrix.cases[1]?.status).toBe("failed");
  });

  it("returns missing_starter when code is empty", async () => {
    const outcome = await runBrowserProjectMatrix({
      code: "   ",
      testCases: [{ id: "a", name: "A", stdin: "" }],
    });
    expect(outcome).toEqual({ status: "error", code: "missing_starter" });
  });
});
