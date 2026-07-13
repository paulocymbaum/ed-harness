import { Navigate, useParams } from "react-router-dom";
import { useMockTestRouteData } from "../../../application/hooks/useMockTestRouteData";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { ErrorPanel } from "../../design-system";
import { MockTestLayoutProvider } from "./MockTestLayoutContext";
import { MockTestShellLayout } from "./components/MockTestShellLayout";

export function MockTestExperienceRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const { t } = useTranslation();
  const { course, mockTest, status, error, reload } = useMockTestRouteData(courseId, moduleId);

  return (
    <AsyncRouteBoundary
      status={status}
      error={error}
      onRetry={reload}
      loadingMessage={t("mockTest.loading")}
      errorTitle={t("error.loadCourse")}
      notFoundTitle={t("mockTest.notFound")}
      isEmpty={status === "ready" && (!course || !mockTest)}
    >
      {course && mockTest ? (
        <MockTestLayoutProvider
          value={{ courseId, moduleId, course, mockTest }}
        >
          <MockTestShellLayout />
        </MockTestLayoutProvider>
      ) : status === "ready" ? (
        <ErrorPanel title={t("mockTest.notFound")} />
      ) : null}
    </AsyncRouteBoundary>
  );
}
