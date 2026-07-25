import { BookOpenText } from "lucide-react";
import { useEffect } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useCatalog } from "../../application/hooks/useCatalog";
import { useCatalogPoints } from "../../application/hooks/useCatalogPoints";
import { useLearnerDashboard } from "../../application/hooks/useLearnerDashboard";
import { loadAllCourseScores } from "../../application/usecases/loadAllCourseScores";
import { ContentReaderDialog } from "../features/course-legacy/ContentReaderDialog";
import {
  CatalogScoreSummary,
  CourseScoreBadge,
} from "../features/course-experience/components/CourseScoreSummary";
import { CatalogTabBar, parseCatalogTab } from "../features/catalog/CatalogTabBar";
import { LearnerDashboard } from "../features/catalog/dashboard/LearnerDashboard";
import { AppShell } from "../features/shell/AppShell";
import { Icon } from "../design-system";
import { Breadcrumb } from "../shared/Breadcrumb";
import { usePageChrome } from "./usePageChrome";

export function AppLayout() {
  const {
    course,
    isCourseRoute,
    isMockTestRoute,
    isFocoAtividade,
    pageTitle,
    breadcrumbSegments,
  } = usePageChrome();
  const location = useLocation();
  const isCatalogHome = location.pathname === "/";
  const { courses, status, load } = useCatalog();
  const catalogPoints = useCatalogPoints(courses);
  const learnerDashboard = useLearnerDashboard(courses);
  const [searchParams, setSearchParams] = useSearchParams();
  const catalogTab = parseCatalogTab(searchParams.get("tab"));

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== "ready" || courses.length === 0) return;
    void loadAllCourseScores(courses);
  }, [status, courses]);

  const setCatalogTab = (nextTab: "courses" | "content-map") => {
    if (nextTab === "courses") {
      setSearchParams({});
      return;
    }
    setSearchParams({ tab: nextTab });
  };

  const catalogReady = status === "ready";

  const paceDetail = (
    <LearnerDashboard
      streak={learnerDashboard.streak}
      weeks={learnerDashboard.weeks}
      averagePointsPerWeek={learnerDashboard.averagePointsPerWeek}
      variant="compact"
    />
  );

  const topBarScore = (() => {
    if (isCourseRoute && course) {
      return (
        <CourseScoreBadge
          courseId={course.id}
          course={course}
          variant="header"
          detail={paceDetail}
        />
      );
    }
    if (isCatalogHome && catalogReady) {
      return (
        <CatalogScoreSummary
          totalPoints={catalogPoints.totalPoints}
          totalMax={catalogPoints.totalMax}
          quizPoints={catalogPoints.quizPoints}
          quizMax={catalogPoints.quizMax}
          projectPoints={catalogPoints.projectPoints}
          projectMax={catalogPoints.projectMax}
          detail={paceDetail}
        />
      );
    }
    return null;
  })();

  return (
    <AppShell
      variant={isFocoAtividade ? "foco" : "default"}
      title={pageTitle}
      breadcrumb={
        isCatalogHome ? null : <Breadcrumb segments={breadcrumbSegments} />
      }
      showPomodoro={!isMockTestRoute}
      topBarCenter={topBarScore}
      right={
        isCatalogHome ? (
          <CatalogTabBar
            value={catalogTab}
            onValueChange={setCatalogTab}
            trailing={
              catalogReady ? (
                <div className="flex items-center gap-2 text-meta text-text1">
                  <Icon icon={BookOpenText} />
                  <span>{courses.length}</span>
                </div>
              ) : null
            }
          />
        ) : null
      }
    >
      <Outlet />
      {course?.structure === "legacy" ? <ContentReaderDialog /> : null}
    </AppShell>
  );
}
