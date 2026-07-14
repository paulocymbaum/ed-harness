import { FolderKanban } from "lucide-react";
import type { PendingProjectRow } from "../../../../application/selectors/learnerDashboard";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Accordion, EmptyState, Icon } from "../../../design-system";

export function PendingProjectsList(props: {
  projects: PendingProjectRow[];
  onOpenProject: (project: PendingProjectRow) => void;
}) {
  const { t } = useTranslation();
  const count = props.projects.length;

  return (
    <Accordion
      defaultOpen={count > 0}
      title={
        <div className="flex min-w-0 items-center gap-2">
          <Icon icon={FolderKanban} size={16} className="shrink-0 text-accent0" />
          <span className="truncate text-meta font-semibold text-text1">
            {t("dashboard.pendingProjects")}
          </span>
          <span className="shrink-0 rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 text-meta tabular-nums text-text0">
            {count}
          </span>
        </div>
      }
    >
      {count === 0 ? (
        <EmptyState
          className="border-0 bg-transparent p-0"
          title={t("dashboard.pendingEmpty.title")}
          description={t("dashboard.pendingEmpty.description")}
        />
      ) : (
        <ul className="m-0 grid list-none gap-2 p-0">
          {props.projects.map((project) => (
            <li key={`${project.courseId}:${project.lessonId ?? "_"}:${project.projectId}`}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-left transition-colors hover:border-accent0/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent0"
                onClick={() => props.onOpenProject(project)}
                aria-label={t("dashboard.openProject")}
              >
                <span className="min-w-0">
                  <span className="block truncate text-body font-medium text-text0">
                    {project.title}
                  </span>
                  <span className="block truncate text-meta text-text1">{project.courseTitle}</span>
                </span>
                <span className="shrink-0 text-meta text-text1">
                  {project.status === "doing"
                    ? t("dashboard.projectDoing")
                    : t("dashboard.projectPending")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Accordion>
  );
}
