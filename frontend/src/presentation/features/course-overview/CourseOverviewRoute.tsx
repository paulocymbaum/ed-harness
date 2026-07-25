import type { Course } from "../../../domain/types/catalog";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { sortByGraphIndex } from "../../../application/selectors/lessonDisplay";
import { getMockTestsForCourse } from "../../../application/selectors/mockTestSelectors";
import { Card } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { ModuleList } from "./components/ModuleList";
import { MockTestList } from "./components/MockTestList";

export function CourseOverviewRoute(props: { courseId: string; course: Course }) {
  const { t } = useTranslation();
  const modules = sortByGraphIndex(props.course.modules ?? []);
  const mockTests = sortByGraphIndex(getMockTestsForCourse(props.course));
  const showReadme = hasDisplayableReadme(props.course.readmeMarkdown, props.course.title);

  return (
    <section className="grid gap-6">
      <ModuleList courseId={props.courseId} modules={modules} />
      <MockTestList courseId={props.courseId} mockTests={mockTests} />

      {showReadme ? (
        <Card variant="panel" className="p-4">
          <ReadmePanel
            markdown={props.course.readmeMarkdown}
            title={props.course.title}
            variant="card"
          />
        </Card>
      ) : null}

      {modules.length === 0 && mockTests.length === 0 ? (
        <Card variant="panel" className="p-4 text-meta text-text1">
          {t("course.emptyContent")}
        </Card>
      ) : null}
    </section>
  );
}
