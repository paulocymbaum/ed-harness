import { Navigate, Outlet, useLocation, useParams, useSearchParams } from "react-router-dom";
import type { Course } from "../../../domain/types/catalog";
import { getModuleById } from "../../../application/selectors/catalogSelectors";
import { getMockTestById } from "../../../application/selectors/mockTestSelectors";
import { resolveActiveModulePageQuiz } from "../../../application/selectors/moduleSelectors";
import { useCourseRouteData } from "../../../application/hooks/useCourseRouteData";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { ErrorPanel } from "../../design-system";
import { ModuleLayoutProvider } from "./ModuleLayoutContext";
import { ModuleQuizPage } from "./ModuleQuizPage";

export function ModuleLayoutRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { course, status, error, reload } = useCourseRouteData(courseId);
  const activeQuizId = searchParams.get("quiz");
  const isMockTestRoute = location.pathname.includes("/mock-test");

  useQuizSessionFromUrl({
    quizId: activeQuizId,
    moduleId,
    enabled: Boolean(activeQuizId && course && !isMockTestRoute),
  });

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage={t("module.loading")}
      errorTitle={t("error.loadCourse")}
      notFoundTitle={t("error.courseNotFound")}
      isEmpty={status === "ready" && !course}
    >
      {course ? (
        <ModuleLayoutBody
          courseId={courseId}
          moduleId={moduleId}
          course={course}
          activeQuizId={activeQuizId}
          isMockTestRoute={isMockTestRoute}
        />
      ) : null}
    </AsyncRouteBoundary>
  );
}

function ModuleLayoutBody(props: {
  courseId: string;
  moduleId: string;
  course: Course;
  activeQuizId: string | null;
  isMockTestRoute: boolean;
}) {
  const { t } = useTranslation();
  const mockTest = getMockTestById(props.course, props.moduleId);

  if (mockTest && !props.isMockTestRoute) {
    return (
      <Navigate
        to={`/course/${encodeURIComponent(props.courseId)}/module/${encodeURIComponent(props.moduleId)}/mock-test`}
        replace
      />
    );
  }

  if (props.isMockTestRoute) {
    return <Outlet />;
  }

  const mod = getModuleById(props.course, props.moduleId);

  if (!mod) {
    return <ErrorPanel title={t("error.moduleNotFound")} />;
  }

  const activeModuleQuiz = resolveActiveModulePageQuiz(
    props.course,
    props.moduleId,
    props.activeQuizId,
  );

  if (activeModuleQuiz) {
    return (
      <ModuleQuizPage courseId={props.courseId} course={props.course} quiz={activeModuleQuiz} />
    );
  }

  return (
    <ModuleLayoutProvider
      value={{
        courseId: props.courseId,
        moduleId: props.moduleId,
        course: props.course,
        module: mod,
      }}
    >
      <Outlet />
    </ModuleLayoutProvider>
  );
}
