import { useEffect } from "react";
import { syncQuizSessionFromUrl } from "./syncQuizSessionFromUrl";

export function useQuizSessionFromUrl(options: {
  quizId: string | null;
  lessonId?: string;
  moduleId?: string;
  enabled?: boolean;
  resetWhenDisabled?: boolean;
}) {
  const { quizId, lessonId, moduleId, enabled = true, resetWhenDisabled = false } = options;

  useEffect(() => {
    syncQuizSessionFromUrl({ quizId, lessonId, moduleId, enabled, resetWhenDisabled });
  }, [enabled, quizId, lessonId, moduleId, resetWhenDisabled]);
}
