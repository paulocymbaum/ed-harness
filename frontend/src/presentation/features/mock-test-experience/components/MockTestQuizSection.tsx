import type { Course } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { QuizHost } from "../../quiz/components/QuizHost";

export function MockTestQuizSection(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
  moduleId: string;
}) {
  const { goBackToMockTestOverview } = useAppNavigation();

  return (
    <QuizHost
      layout="page"
      courseId={props.courseId}
      course={props.course}
      quiz={props.quiz}
      onClose={() => goBackToMockTestOverview(props.courseId, props.moduleId)}
    />
  );
}
