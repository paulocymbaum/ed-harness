import type { ProjectRunOutcome } from "../../domain/types/projectRun";
import type { ProjectTestCase } from "./projectTestCases";
import { getProjectRunRepository } from "./projectRun";
import { resolveRunCodeFromDraft } from "./extractStarterIndexFromDraft";
import { runBrowserProjectMatrix } from "./runBrowserProjectMatrix";

function shouldFallbackToBrowser(outcome: ProjectRunOutcome | null): boolean {
  if (outcome === null) return true;
  return outcome.status === "error" && outcome.code === "unavailable";
}

export async function runProjectStarter(input: {
  courseId: string;
  rootPath: string;
  draft: string;
  /** Used when the Node API is unavailable (static / deployed builds). */
  testCases?: ProjectTestCase[] | null;
  /** Disk starter when the draft has no extractable source. */
  starterCode?: string | null;
}): Promise<ProjectRunOutcome | null> {
  const fromDraft = resolveRunCodeFromDraft(input.draft);
  const code = fromDraft ?? (input.starterCode?.trim() ? input.starterCode : undefined);
  const repository = getProjectRunRepository();

  if (repository) {
    const outcome = await repository.run(input.courseId, input.rootPath, code);
    if (!shouldFallbackToBrowser(outcome)) return outcome;
  }

  const testCases = input.testCases;
  if (!testCases?.length) {
    return repository ? { status: "error", code: "unavailable" } : null;
  }

  if (!code?.trim()) return { status: "error", code: "missing_starter" };
  return runBrowserProjectMatrix({ code, testCases });
}
