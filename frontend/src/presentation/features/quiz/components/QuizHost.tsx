import type { Course } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import type { TranslationKey } from "../../../../infrastructure/i18n/locales/en";
import { QuizSessionPanel } from "./QuizSessionPanel";

export type QuizHostLayout = "page" | "drawer";

export function QuizHost(props: {
  layout: QuizHostLayout;
  courseId: string;
  course: Course;
  quiz: Quiz;
  onClose: () => void;
  backLabelKey?: TranslationKey;
}) {
  return (
    <QuizSessionPanel
      courseId={props.courseId}
      course={props.course}
      quiz={props.quiz}
      onBackToList={props.onClose}
      compact={props.layout === "drawer"}
      backLabelKey={props.backLabelKey}
    />
  );
}
