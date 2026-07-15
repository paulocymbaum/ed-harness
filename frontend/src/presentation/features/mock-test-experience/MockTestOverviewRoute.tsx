import { Navigate, useParams } from "react-router-dom";
import { getFirstMockTestSection } from "../../../application/selectors/mockTestSelectors";
import { useMockTestRouteData } from "../../../application/hooks/useMockTestRouteData";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { AsyncRouteBoundary } from "../../shared/AsyncRouteBoundary";
import { Button, ErrorPanel } from "../../design-system";
import { MockTestHeader } from "./components/MockTestHeader";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";

export function MockTestOverviewRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const { t } = useTranslation();
  const { goMockTestSection } = useAppNavigation();
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
        <div className="grid gap-4 p-4">
          <MockTestHeader courseId={courseId} mockTest={mockTest} />

          {hasDisplayableReadme(mockTest.readmeMarkdown, mockTest.title) ? (
            <ReadmePanel
              markdown={mockTest.readmeMarkdown}
              title={mockTest.title}
              variant="card"
            />
          ) : null}

          {(() => {
            const first = getFirstMockTestSection(mockTest);
            if (!first) return null;
            return (
              <div>
                <Button
                  variant="primary"
                  onClick={() => goMockTestSection(courseId, moduleId, first.lessonId)}
                >
                  {t("mockTest.start")}
                </Button>
              </div>
            );
          })()}
        </div>
      ) : (
        <ErrorPanel title={t("mockTest.notFound")} />
      )}
    </AsyncRouteBoundary>
  );
}
