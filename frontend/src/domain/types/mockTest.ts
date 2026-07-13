import type { Lesson, Project } from "./catalog";
import type { Quiz } from "./quiz";

export type MockTestSectionType = "instructions" | "quiz" | "coding";

export type MockTestSection = {
  lessonId: string;
  type: MockTestSectionType;
};

export type MockTestMeta = {
  id: string;
  kind: "mock-test";
  durationMinutes: number;
  passingScorePercent: number;
  sections: MockTestSection[];
};

export type MockTestModule = {
  id: string;
  title: string;
  graphIndex?: string;
  readmePath: string;
  readmeMarkdown: string;
  lessons: Lesson[];
  projects: Project[];
  quizzes: Quiz[];
  mockTest: MockTestMeta;
};
