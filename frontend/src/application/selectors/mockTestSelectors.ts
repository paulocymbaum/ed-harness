import type { Course, Lesson } from "../../domain/types/catalog";
import type { MockTestModule, MockTestSection, MockTestSectionType } from "../../domain/types/mockTest";
import type { Project } from "../../domain/types/catalog";
import type { Quiz } from "../../domain/types/quiz";
import type { TranslationKey } from "../../infrastructure/i18n/locales/en";

export function isMockTestModuleId(moduleId: string): boolean {
  return moduleId.endsWith("-mock");
}

export function getMockTestsForCourse(course: Course): MockTestModule[] {
  return course.mockTests ?? [];
}

export function getMockTestById(course: Course, moduleId: string): MockTestModule | null {
  return getMockTestsForCourse(course).find((m) => m.id === moduleId) ?? null;
}

export function getMockTestSection(
  mockTest: MockTestModule,
  sectionId: string,
): MockTestSection | null {
  return mockTest.mockTest.sections.find((s) => s.lessonId === sectionId) ?? null;
}

export function getMockTestLesson(
  mockTest: MockTestModule,
  sectionId: string,
): Lesson | null {
  return mockTest.lessons.find((l) => l.id === sectionId) ?? null;
}

export function getMockTestQuiz(
  mockTest: MockTestModule,
  sectionId: string,
): Quiz | null {
  const section = getMockTestSection(mockTest, sectionId);
  if (!section || section.type !== "quiz") return null;
  return mockTest.quizzes.find((q) => q.lessonId === sectionId) ?? null;
}

export function getMockTestProject(
  mockTest: MockTestModule,
  sectionId: string,
): Project | null {
  const section = getMockTestSection(mockTest, sectionId);
  if (!section || section.type !== "coding") return null;
  return mockTest.projects.find((p) => p.lessonId === sectionId) ?? null;
}

export function getFirstMockTestSection(mockTest: MockTestModule): MockTestSection | null {
  return mockTest.mockTest.sections[0] ?? null;
}

export function sectionTypeLabelKey(type: MockTestSectionType): TranslationKey {
  switch (type) {
    case "instructions":
      return "mockTest.section.instructions";
    case "quiz":
      return "mockTest.section.quiz";
    case "coding":
      return "mockTest.section.coding";
  }
}
