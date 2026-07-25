import { Outlet } from "react-router-dom";
import { ContentReaderDialog } from "../features/course-legacy/ContentReaderDialog";
import { CourseScoreBadge } from "../features/course-experience/components/CourseScoreSummary";
import { AppShell } from "../features/shell/AppShell";
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

  return (
    <AppShell
      variant={isFocoAtividade ? "foco" : "default"}
      title={pageTitle}
      breadcrumb={<Breadcrumb segments={breadcrumbSegments} />}
      showPomodoro={!isMockTestRoute}
      right={
        isCourseRoute && course && !isMockTestRoute ? (
          <CourseScoreBadge courseId={course.id} course={course} />
        ) : null
      }
    >
      <Outlet />
      {course?.structure === "legacy" ? <ContentReaderDialog /> : null}
    </AppShell>
  );
}
