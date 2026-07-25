import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { migrateProgressKeysFromCatalog } from "../../../application/usecases/migrateProgressKeys";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ContentMapPanel } from "../content-map/ContentMapPanel";
import { CatalogCoursesPanel } from "./CatalogCoursesPanel";
import { parseCatalogTab } from "./CatalogTabBar";

export function CatalogRoute() {
  const { status, courses, error, load, reload } = useCatalog();
  const { goCourse } = useAppNavigation();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const tab = parseCatalogTab(searchParams.get("tab"));

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== "ready" || courses.length === 0) return;
    migrateProgressKeysFromCatalog({ courses });
  }, [status, courses]);

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
          ? "flex h-[min(40rem,calc(100dvh-9rem))] max-h-[calc(100dvh-9rem)] flex-1 flex-col gap-4"
          : "grid gap-4"
      }
    >
      {isContentMap ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <ContentMapPanel />
        </div>
      ) : (
        <CatalogCoursesPanel courses={courses} onOpenCourse={goCourse} />
      )}
    </section>
  );
}
