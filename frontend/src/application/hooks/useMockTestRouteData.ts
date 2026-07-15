import { useMemo } from "react";
import { useParams } from "react-router-dom";
import type { Course } from "../../domain/types/catalog";
import type { MockTestModule } from "../../domain/types/mockTest";
import { getMockTestById, getMockTestSection } from "../selectors/mockTestSelectors";
import { useCourseRouteData } from "./useCourseRouteData";

export function useMockTestRouteData(courseId: string, moduleId: string) {
  const route = useCourseRouteData(courseId);

  const mockTest = useMemo(() => {
    if (!route.course) return null;
    return getMockTestById(route.course, moduleId);
  }, [route.course, moduleId]);

  return { ...route, mockTest };
}

export function useMockTestSectionRouteData(
  courseId: string,
  moduleId: string,
  sectionId: string,
) {
  const { course, mockTest, status, error, reload } = useMockTestRouteData(courseId, moduleId);

  const section = useMemo(() => {
    if (!mockTest) return null;
    return getMockTestSection(mockTest, sectionId);
  }, [mockTest, sectionId]);

  return { course, mockTest, section, status, error, reload };
}

export function useMockTestParams() {
  const { courseId = "", moduleId = "", sectionId = "" } = useParams();
  return { courseId, moduleId, sectionId };
}

export type MockTestRouteContext = {
  courseId: string;
  moduleId: string;
  course: Course;
  mockTest: MockTestModule;
};
