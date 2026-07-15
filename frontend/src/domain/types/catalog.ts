import type { MockTestModule } from "./mockTest";
import type { Quiz } from "./quiz";

export type Catalog = {
  courses: Course[];
};

export type CourseKind = "course" | "mock-tests";

export type Course = {
  id: string;
  title: string;
  readmePath: string;
  readmeMarkdown: string;
  /** Present for hierarchy courses (course/<slug>/modules/) */
  modules?: Module[];
  /** Timed HackerRank-style tests (modules ending with `-mock`) */
  mockTests?: MockTestModule[];
  lessons: Lesson[];
  projects: Project[];
  quizzes: Quiz[];
  /** `hierarchy` | `legacy` — omitted on older catalog entries */
  structure?: "hierarchy" | "legacy";
  kind?: CourseKind;
};

export type Module = {
  id: string;
  title: string;
  graphIndex?: string;
  readmePath: string;
  readmeMarkdown: string;
  lessons: Lesson[];
  projects: Project[];
  quizzes: Quiz[];
};

export type MockTestSectionKind = "instructions" | "quiz" | "coding";

export type Lesson = {
  id: string;
  title: string;
  path: string;
  markdown: string;
  moduleId?: string;
  graphIndex?: string;
  /** Present on mock-test section lessons */
  mockTestSection?: MockTestSectionKind;
};

export type ProjectEntry = {
  /** POSIX path, relative to repo root */
  path: string;
  kind: "dir" | "file";
  /** For dir entries: README.md content (if present) */
  readmeMarkdown?: string;
  /** For file entries: UTF-8 file content (if supported/kept) */
  content?: string;
};

export type Project = {
  id: string;
  title: string;
  /** POSIX path to project root folder */
  rootPath: string;
  /** POSIX path to root README.md */
  readmePath: string;
  /** Root README.md markdown */
  readmeMarkdown: string;
  /** Flat manifest of folders/files under rootPath */
  entries: ProjectEntry[];
  moduleId?: string;
  lessonId?: string;
  graphIndex?: string;
};
