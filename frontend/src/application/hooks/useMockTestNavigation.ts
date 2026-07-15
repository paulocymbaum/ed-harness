import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizSessionStore } from "../stores/quizSessionStore";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";

function mockTestBasePath(courseId: string, moduleId: string): string {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/mock-test`;
}

export function useMockTestNavigation() {
  const navigate = useNavigate();

  const goMockTest = useCallback(
    (courseId: string, moduleId: string) => {
      closeReaderBeforeNavigate();
      navigate(mockTestBasePath(courseId, moduleId));
    },
    [navigate],
  );

  const goMockTestSection = useCallback(
    (courseId: string, moduleId: string, sectionId: string) => {
      closeReaderBeforeNavigate();
      navigate(`${mockTestBasePath(courseId, moduleId)}/section/${encodeURIComponent(sectionId)}`);
    },
    [navigate],
  );

  const startMockTestQuiz = useCallback(
    (courseId: string, moduleId: string, sectionId: string, quizId: string) => {
      useQuizSessionStore.getState().start(quizId, sectionId);
      goMockTestSection(courseId, moduleId, sectionId);
    },
    [goMockTestSection],
  );

  const goBackToMockTestOverview = useCallback(
    (courseId: string, moduleId: string) => {
      useQuizSessionStore.getState().reset();
      goMockTest(courseId, moduleId);
    },
    [goMockTest],
  );

  return {
    goMockTest,
    goMockTestSection,
    startMockTestQuiz,
    goBackToMockTestOverview,
  };
}
