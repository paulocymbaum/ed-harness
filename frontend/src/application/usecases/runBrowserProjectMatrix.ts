import type { ProjectTestCase } from "../usecases/projectTestCases";
import { evaluateTestCase } from "../usecases/projectTestCases";
import type { ProjectRunOutcome, ProjectTestCaseResult } from "../../domain/types/projectRun";
import { runNodeLikeInBrowser } from "../../infrastructure/project-run/runNodeLikeInBrowser";

const PROJECT_RUN_TIMEOUT_MS = 5000;

export async function runBrowserProjectMatrix(input: {
  code: string;
  testCases: ProjectTestCase[];
}): Promise<ProjectRunOutcome> {
  const { code, testCases } = input;
  if (!code.trim()) return { status: "error", code: "missing_starter" };
  if (!testCases.length) return { status: "error", code: "missing_tests" };

  const cases: ProjectTestCaseResult[] = [];

  for (const testCase of testCases) {
    const runResult = await runNodeLikeInBrowser(
      code,
      testCase.stdin ?? "",
      PROJECT_RUN_TIMEOUT_MS,
    );
    const evaluation = evaluateTestCase(testCase, runResult);
    const failureReason = evaluation.failureReason;
    cases.push({
      id: testCase.id,
      name: testCase.name,
      status: evaluation.status,
      command: `node <draft> < ${testCase.id}`,
      stdin: testCase.stdin ?? "",
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      exitCode: runResult.exitCode,
      timedOut: runResult.timedOut,
      ...(typeof testCase.expectedStdout === "string"
        ? { expectedStdout: testCase.expectedStdout }
        : {}),
      ...(typeof testCase.expectedExitCode === "number"
        ? { expectedExitCode: testCase.expectedExitCode }
        : {}),
      ...(failureReason === "stdout_mismatch" ||
      failureReason === "exit_code" ||
      failureReason === "timeout" ||
      failureReason === "error"
        ? { failureReason }
        : {}),
    });
  }

  const passedCount = cases.filter((item) => item.status === "passed").length;
  const failedCount = cases.filter((item) => item.status === "failed").length;

  return {
    status: "ok",
    matrix: {
      passedCount,
      failedCount,
      totalCount: cases.length,
      cases,
    },
  };
}
