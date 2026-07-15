import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useContentGraph } from "../../../application/hooks/useContentGraph";
import { useContentGraphScores } from "../../../application/hooks/useContentGraphScores";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import {
  buildCatalogLessonIndex,
  countEnrichedLessonStats,
  enrichContentGraphWithCatalog,
} from "../../../application/selectors/contentGraphCatalog";
import { isHierarchyCourse } from "../../../application/selectors/catalogSelectors";
import type { ContentGraphNode } from "../../../domain/types/contentGraph";
import { ErrorPanel, LoadingState } from "../../design-system";
import { MindMapCanvas } from "./MindMapCanvas";

function coveragePercent(exists: number, totalLeaves: number): number {
  if (totalLeaves <= 0) return 0;
  return Math.round((exists / totalLeaves) * 100);
}

export function ContentMapPanel() {
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
        title="Content map unavailable"
        message="No study courses with a content graph were found."
      />
    );
  }

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading content map…" />;
  }

  if (status === "error" || !graph || !enrichedRoot) {
    return (
      <ErrorPanel
        title="Content map unavailable"
        message={error ?? "Content graph failed to load."}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <section className="flex h-full min-h-[20rem] flex-col gap-3">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="m-0 text-body font-semibold text-text0">Content Map</h2>
          <p className="m-0 mt-1 text-meta text-text1">
            {lessonStats.exists} exists · {lessonStats.planned} planned · {coverage}% coverage
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 items-center gap-2 text-meta text-text1">
            <span className="shrink-0">Course</span>
            <select
              className="max-w-full rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {selectableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title || course.id}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
            onClick={expandAll}
          >
            Expand all
          </button>
          <button
            type="button"
            className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
            onClick={collapseAll}
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
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
