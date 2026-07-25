import { useTranslation } from "../../../application/hooks/useTranslation";

export function ContentMapToolbar(props: {
  selectedCourseId: string;
  selectableCourses: Array<{ id: string; title: string }>;
  metaLabel: string;
  onSelectCourse: (courseId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="m-0 text-body font-semibold text-text0">{t("contentMap.title")}</h2>
        <p className="m-0 mt-1 text-meta text-text1">{props.metaLabel}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex min-w-0 items-center gap-2 text-meta text-text1">
          <span className="shrink-0">{t("contentMap.course")}</span>
          <select
            className="max-w-full rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0"
            value={props.selectedCourseId}
            onChange={(e) => props.onSelectCourse(e.target.value)}
          >
            {props.selectableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title || course.id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
          onClick={props.onExpandAll}
        >
          {t("contentMap.expandAll")}
        </button>
        <button
          type="button"
          className="rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-meta font-medium text-text0 transition hover:bg-surfacePanel"
          onClick={props.onCollapseAll}
        >
          {t("contentMap.collapseAll")}
        </button>
      </div>
    </div>
  );
}
