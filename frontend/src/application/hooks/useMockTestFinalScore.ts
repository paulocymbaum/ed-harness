import { useMemo } from "react";
import type { MockTestModule } from "../../domain/types/mockTest";
import { computeMockTestFinalScore } from "../selectors/mockTestScore";
import { useProjectDeliveryStore } from "../stores/projectDeliveryStore";
import { useQuizProgressStore } from "../stores/quizProgressStore";

export function useMockTestFinalScore(courseId: string, mockTest: MockTestModule) {
  const quizByKey = useQuizProgressStore((state) => state.byKey);
  const deliveriesByKey = useProjectDeliveryStore((state) => state.deliveriesByKey);

  return useMemo(
    () =>
      computeMockTestFinalScore({
        courseId,
        mockTest,
        quizByKey,
        deliveriesByKey,
      }),
    [courseId, mockTest, quizByKey, deliveriesByKey],
  );
}
