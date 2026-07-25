import type { ReactNode } from "react";
import type { Course } from "../../../../domain/types/catalog";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { Trophy } from "lucide-react";
import {
  AggregatedScoreDisplay,
  toAggregatedScoreMetrics,
} from "../../../shared/score";

export function CourseScoreBadge(props: {
  courseId: string;
  course: Course;
  className?: string;
  /** Prefer `header` in AppTopBar so catalog and course pages share one chrome. */
  variant?: "badge" | "header";
  detail?: ReactNode;
}) {
  const { t } = useTranslation();
  const points = useCoursePoints(props.courseId, props.course);
  const variant = props.variant ?? "badge";

  return (
    <AggregatedScoreDisplay
      variant={variant === "header" ? "catalog" : "badge"}
      title={t("course.scoreProgress")}
      icon={Trophy}
      className={props.className}
      metrics={toAggregatedScoreMetrics(points)}
      detail={variant === "header" ? props.detail : undefined}
    />
  );
}

export function CourseScoreSummary(props: {
  courseId: string;
  course: Course;
  variant?: "full" | "compact";
}) {
  const { t } = useTranslation();
  const points = useCoursePoints(props.courseId, props.course);

  return (
    <AggregatedScoreDisplay
      variant={props.variant ?? "full"}
      title={t("course.score")}
      icon={Trophy}
      metrics={toAggregatedScoreMetrics(points)}
    />
  );
}

export function CatalogScoreSummary(props: {
  totalPoints: number;
  totalMax: number;
  quizPoints: number;
  quizMax: number;
  projectPoints: number;
  projectMax: number;
  detail?: ReactNode;
}) {
  return (
    <AggregatedScoreDisplay
      variant="catalog"
      icon={Trophy}
      metrics={toAggregatedScoreMetrics(props)}
      detail={props.detail}
    />
  );
}
