import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useContentGraph } from "../../../application/hooks/useContentGraph";
import { useContentGraphScores } from "../../../application/hooks/useContentGraphScores";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import {
  buildCatalogLessonIndex,
  countEnrichedLessonStats,
  enrichContentGraphWithCatalog,
} from "../../../application/selectors/contentGraphCatalog";
import { isHierarchyCourse } from "../../../application/selectors/catalogSelectors";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ContentMapToolbar } from "./ContentMapToolbar";
import { MindMapCanvas } from "./MindMapCanvas";

function coveragePercent(exists: number, totalLeaves: number): number {
  if (totalLeaves <= 0) return 0;
  return Math.round((exists / totalLeaves) * 100);
}

export function ContentMapPanel() {
  const { t } = useTranslation();
  const { courses } = useCatalog();
  const { goLesson } = useAppNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const hierarchyCourses = useMemo(
    () => courses.filter(isHierarchyCourse),
    [courses],
  );

  const courseFromQuery = searchParams.get("course");
  const selectedCourseId =
    courseFromQuery && hierarchyCourses.some((c) => c.id === courseFromQuery)
      ? courseFromQuery
      : hierarchyCourses[0]?.id ?? null;

  const { status, graph, error, reload, courseSlugs } = useContentGraph(selectedCourseId);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setCollapsedIds(new Set());
  }, [selectedCourseId]);

  const setSelectedCourse = useCallback(
    (courseId: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", "content-map");
        next.set("course", courseId);
        return next;
      });
    },
    [setSearchParams],
  );

  const enrichedRoot = useMemo(() => {
    if (!graph?.root || !selectedCourseId) return null;
    const catalogIndex = buildCatalogLessonIndex(courses, selectedCourseId);
    return enrichContentGraphWithCatalog(graph.root, catalogIndex);
  }, [graph?.root, selectedCourseId, courses]);

  const scores = useContentGraphScores(enrichedRoot, courses);

  const lessonStats = useMemo(() => {
    if (!enrichedRoot) return { exists: 0, planned: 0, totalLeaves: 0 };
    const counts = countEnrichedLessonStats(enrichedRoot);
    return {
      ...counts,
      totalLeaves: counts.exists + counts.planned,
    };
  }, [enrichedRoot]);

  const coverage = coveragePercent(lessonStats.exists, lessonStats.totalLeaves);

  const branchNodeIds = useMemo(() => {
    const root = enrichedRoot;
    if (!root) return [];
    const ids: string[] = [];
    function walk(node: ContentGraphNode) {
      if (node.children.length > 0) ids.push(node.id);
      for (const child of node.children) walk(child);
    }
    walk(root);
    return ids;
  }, [enrichedRoot]);

  const toggleCollapse = useCallback((nodeId: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setCollapsedIds(new Set(branchNodeIds));
  }, [branchNodeIds]);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  const selectableCourses = hierarchyCourses.filter(
    (c) => courseSlugs.length === 0 || courseSlugs.includes(c.id),
  );

  if (!selectedCourseId) {
    return (
      <ErrorPanel
        title={t("contentMap.unavailable")}
        message={t("contentMap.noCourses")}
      />
    );
  }

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("contentMap.loading")} />;
  }

  if (status === "error" || !graph || !enrichedRoot) {
    return (
      <ErrorPanel
        title={t("contentMap.unavailable")}
        message={error ?? t("contentMap.loadFailed")}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <ContentMapToolbar
        selectedCourseId={selectedCourseId}
        selectableCourses={selectableCourses.map((c) => ({
          id: c.id,
          title: c.title || c.id,
        }))}
        metaLabel={t("contentMap.meta", {
          exists: lessonStats.exists,
          planned: lessonStats.planned,
          coverage,
        })}
        onSelectCourse={setSelectedCourse}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <MindMapCanvas
          root={enrichedRoot}
          courseSlug={graph.courseSlug}
          collapsedIds={collapsedIds}
          scores={scores}
          onToggleCollapse={toggleCollapse}
          onOpenLesson={(catalogRef) =>
            goLesson(catalogRef.courseId, catalogRef.moduleId, catalogRef.lessonId)
          }
        />
      </div>
    </section>
  );
}
