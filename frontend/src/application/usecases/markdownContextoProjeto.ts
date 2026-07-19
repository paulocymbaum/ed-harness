import type { Project } from "../../domain/types/catalog";
import type { ReaderEntry } from "../../domain/types/reader";

/** Resolve o markdown de contexto do projeto (README da pasta atual ou do projeto). */
export function markdownContextoProjeto(
  project: Project,
  entries: ReaderEntry[],
  cwd: string,
): string {
  const currentDir = entries.find((e) => e.kind === "dir" && e.path === cwd);
  if (currentDir?.readmeMarkdown?.trim()) return currentDir.readmeMarkdown;
  return project.readmeMarkdown;
}
