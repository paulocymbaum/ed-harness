import { useEffect } from "react";
import { BookOpenText } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useCatalogPoints } from "../../../application/hooks/useCatalogPoints";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { loadAllCourseScores } from "../../../application/usecases/loadAllCourseScores";
import { migrateProgressKeysFromCatalog } from "../../../application/usecases/migrateProgressKeys";
import { ErrorPanel, Icon, LoadingState } from "../../design-system";
import { ContentMapPanel } from "../content-map/ContentMapPanel";
import { CatalogScoreSummary } from "../course-experience/components/CourseScoreSummary";
import { CatalogCoursesPanel } from "./CatalogCoursesPanel";
import { CatalogTabBar, parseCatalogTab } from "./CatalogTabBar";

export function CatalogRoute() {
  const { status, courses, error, load, reload } = useCatalog();
  const { goCourse } = useAppNavigation();
  const { t } = useTranslation();
  const catalogPoints = useCatalogPoints(courses);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseCatalogTab(searchParams.get("tab"));

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== "ready" || courses.length === 0) return;
    migrateProgressKeysFromCatalog({ courses });
    void loadAllCourseScores(courses);
  }, [status, courses]);

  const setTab = (nextTab: "courses" | "content-map") => {
    if (nextTab === "courses") {
      setSearchParams({});
      return;
    }
    setSearchParams({ tab: nextTab });
  };

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("catalog.loading")} />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title={t("catalog.error")}
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  const isContentMap = tab === "content-map";

  return (
    <section
      className={
        isContentMap
          ? "flex min-h-[min(36rem,calc(100dvh-11rem))] flex-1 flex-col gap-4"
          : "grid gap-4"
      }
    >
      <CatalogTabBar
        value={tab}
        onValueChange={setTab}
        trailing={
          <>
            <CatalogScoreSummary
              totalPoints={catalogPoints.totalPoints}
              totalMax={catalogPoints.totalMax}
              quizPoints={catalogPoints.quizPoints}
              quizMax={catalogPoints.quizMax}
              projectPoints={catalogPoints.projectPoints}
              projectMax={catalogPoints.projectMax}
            />
            <div className="flex items-center gap-2 text-meta text-text1">
              <Icon icon={BookOpenText} />
              <span>{courses.length}</span>
            </div>
          </>
        }
      />
      {isContentMap ? (
        <div className="min-h-0 flex-1">
          <ContentMapPanel />
        </div>
      ) : (
        <CatalogCoursesPanel courses={courses} onOpenCourse={goCourse} />
      )}
    </section>
  );
}
