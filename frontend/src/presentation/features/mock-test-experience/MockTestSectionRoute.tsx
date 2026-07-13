import { useParams } from "react-router-dom";
import {
  getMockTestLesson,
  getMockTestProject,
  getMockTestQuiz,
} from "../../../application/selectors/mockTestSelectors";
import { useMockTestSectionRouteData } from "../../../application/hooks/useMockTestRouteData";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { ErrorPanel } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { MockTestCodingSection } from "./components/MockTestCodingSection";
import { MockTestQuizSection } from "./components/MockTestQuizSection";

export function MockTestSectionRoute() {
  const { courseId = "", moduleId = "", sectionId = "" } = useParams();
  const { t } = useTranslation();
  const { course, mockTest, section, status, error, reload } = useMockTestSectionRouteData(
    courseId,
    moduleId,
    sectionId,
  );

  const quiz = mockTest && section?.type === "quiz" ? getMockTestQuiz(mockTest, sectionId) : null;

  useQuizSessionFromUrl({
    quizId: quiz?.id ?? null,
    lessonId: sectionId,
    enabled: Boolean(quiz && course),
  });

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage={t("mockTest.loading")}
      errorTitle={t("error.loadCourse")}
      notFoundTitle={t("mockTest.sectionNotFound")}
      isEmpty={status === "ready" && (!course || !mockTest || !section)}
    >
      {course && mockTest && section ? (
        <MockTestSectionBody
          courseId={courseId}
          moduleId={moduleId}
          sectionId={sectionId}
          course={course}
          mockTest={mockTest}
          sectionType={section.type}
        />
      ) : (
        <ErrorPanel title={t("mockTest.sectionNotFound")} />
      )}
    </AsyncRouteBoundary>
  );
}

function MockTestSectionBody(props: {
  courseId: string;
  moduleId: string;
  sectionId: string;
  course: import("../../../domain/types/catalog").Course;
  mockTest: import("../../../domain/types/mockTest").MockTestModule;
  sectionType: import("../../../domain/types/mockTest").MockTestSectionType;
}) {
  const lesson = getMockTestLesson(props.mockTest, props.sectionId);

  if (props.sectionType === "instructions" && lesson) {
    return (
      <div className="overflow-auto p-4">
        <ReadmePanel markdown={lesson.markdown} title={lesson.title} variant="inline" />
      </div>
    );
  }

  if (props.sectionType === "quiz") {
    const quiz = getMockTestQuiz(props.mockTest, props.sectionId);
    if (!quiz) return <ErrorPanel title="Quiz not found" />;
    return (
      <MockTestQuizSection
        courseId={props.courseId}
        course={props.course}
        quiz={quiz}
        moduleId={props.moduleId}
      />
    );
  }

  if (props.sectionType === "coding") {
    const project = getMockTestProject(props.mockTest, props.sectionId);
    if (!project) return <ErrorPanel title="Project not found" />;
    return (
      <MockTestCodingSection
        courseId={props.courseId}
        course={props.course}
        project={project}
      />
    );
  }

  return <ErrorPanel title="Unknown section type" />;
}
