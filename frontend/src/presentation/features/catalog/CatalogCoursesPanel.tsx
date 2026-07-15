import type { Course } from "../../../domain/types/catalog";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useLearnerDashboard } from "../../../application/hooks/useLearnerDashboard";
import { useTranslation } from "../../../application/hooks/useTranslation";
import type { PendingProjectRow } from "../../../application/selectors/learnerDashboard";
import { CourseCard } from "./components/CourseCard";
import { CatalogEmptyState } from "./components/CatalogEmptyState";
import { LearnerDashboard } from "./dashboard/LearnerDashboard";
import { PendingProjectsList } from "./dashboard/PendingProjectsList";

export function CatalogCoursesPanel(props: {
  courses: Course[];
  onOpenCourse: (courseId: string) => void;
}) {
  const { t } = useTranslation();
  const dashboard = useLearnerDashboard(props.courses);
  const { goCourse, openLessonDrawer } = useAppNavigation();

  const openProject = (project: PendingProjectRow) => {
    if (project.moduleId && project.lessonId) {
      openLessonDrawer(
        project.courseId,
        project.moduleId,
        project.lessonId,
        "project",
        project.projectId,
        "delivery",
      );
      return;
    }
    goCourse(project.courseId);
  };

  return (
    <>
      <LearnerDashboard
        streak={dashboard.streak}
        weeks={dashboard.weeks}
        averagePointsPerWeek={dashboard.averagePointsPerWeek}
      />

      <div className="mb-3 mt-2">
        <h2 className="m-0 text-body font-semibold text-text0">{t("catalog.title")}</h2>
      </div>

      {props.courses.length === 0 ? <CatalogEmptyState /> : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2" data-tour="course-list">
        {props.courses.map((course) => (
          <CourseCard
            key={course.id}
            courseId={course.id}
            course={course}
            onOpen={() => props.onOpenCourse(course.id)}
          />
        ))}
      </div>

      <div className="mt-3">
        <PendingProjectsList
          projects={dashboard.pendingProjects}
          onOpenProject={openProject}
        />
      </div>
    </>
  );
}
