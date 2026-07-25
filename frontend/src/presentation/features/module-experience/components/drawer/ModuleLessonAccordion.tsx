import clsx from "clsx";
import {
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  FileCode,
  HelpCircle,
} from "lucide-react";
import type { Lesson } from "../../../../../domain/types/catalog";
import type { LessonActivityItem } from "../../../../../application/selectors/lessonProgress";
import { getLessonDisplayIndex } from "../../../../../application/selectors/lessonDisplay";
import { useTranslation } from "../../../../../application/hooks/useTranslation";
import type { TranslationParams } from "../../../../../domain/i18n/translate";
import type { TranslationKey } from "../../../../../infrastructure/i18n/locales/en";
import { formatScoreLabel } from "../../../../../domain/scoreProgress";
import { Icon, ProgressBar } from "../../../../design-system";
import { ModuleNavRow } from "./ModuleNavRow";
import type { ActivityStatusTone } from "./ActivityStatusBadge";

function activityStatusBadge(
  item: LessonActivityItem,
  t: (key: TranslationKey, params?: TranslationParams) => string,
): { label: string; tone: ActivityStatusTone } {
  if (item.kind === "quiz") {
    if (!item.done) {
      return { label: t("activity.notStarted"), tone: "neutral" };
    }
    return {
      label: t("activity.quizBest", { pct: item.quizScore ?? 0 }),
      tone: "done",
    };
  }

  if (item.projectStatus === "done") {
    return { label: t("project.done"), tone: "done" };
  }
  if (item.projectStatus === "doing") {
    return { label: t("project.doing"), tone: "doing" };
  }
  return { label: t("project.pending"), tone: "neutral" };
}

export function ModuleLessonAccordion(props: {
  lesson: Lesson;
  items: LessonActivityItem[];
  scorePoints?: { value: number; max: number };
  isActiveLesson: boolean;
  activeQuizId: string | null;
  activeProjectId: string | null;
  defaultOpen?: boolean;
  /** When true, omit the leading index (parent section already shows it). */
  hideIndex?: boolean;
  onOpenLesson: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const { t } = useTranslation();
  const displayIndex = getLessonDisplayIndex(props.lesson);
  const hasScore = (props.scorePoints?.max ?? 0) > 0;
  const progressPercent =
    hasScore && props.scorePoints
      ? Math.round((props.scorePoints.value / props.scorePoints.max) * 100)
      : 0;

  return (
    <details className="group mb-1 min-w-0" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex min-w-0 cursor-pointer list-none flex-col gap-1 rounded-panel px-2 py-1.5",
          "[&::-webkit-details-marker]:hidden",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.isActiveLesson && "border-l-2 border-accent0 bg-surfaceAccent/35 pl-[calc(0.5rem-2px)]",
        )}
      >
        <div className="flex min-h-7 min-w-0 items-start gap-2">
          {!props.hideIndex ? (
            <span className="w-12 shrink-0 pt-0.5 font-mono text-meta text-accent0">
              {displayIndex}
            </span>
          ) : null}
          <span className="min-w-0 flex-1 text-meta font-medium leading-snug text-text0 [overflow-wrap:anywhere]">
            {props.lesson.title}
          </span>
          {hasScore && props.scorePoints ? (
            <span className="shrink-0 pt-0.5 text-meta font-medium text-text1">
              {formatScoreLabel(props.scorePoints.value, props.scorePoints.max)}
            </span>
          ) : null}
          <Icon
            icon={ChevronDown}
            size={14}
            className="mt-0.5 shrink-0 text-text1 transition group-open:rotate-180"
          />
        </div>
        {hasScore && props.scorePoints && progressPercent > 0 ? (
          <div
            className={clsx("min-w-0 pr-6", props.hideIndex ? "pl-0" : "pl-14")}
            onClick={(event) => event.stopPropagation()}
          >
            <ProgressBar
              value={props.scorePoints.value}
              max={props.scorePoints.max}
              size="xs"
              aria-label={`${t("lesson.score")}: ${formatScoreLabel(props.scorePoints.value, props.scorePoints.max)}`}
            />
          </div>
        ) : null}
      </summary>

      <div className="grid min-w-0 gap-0.5 py-1 pl-2">
        <ModuleNavRow
          icon={BookOpenText}
          label={t("module.explanation")}
          sublabel={t("module.explanationSublabel")}
          active={props.isActiveLesson && !props.activeQuizId && !props.activeProjectId}
          onClick={props.onOpenLesson}
        />

        {props.items.map((item) => (
          <ModuleNavRow
            key={`${item.kind}-${item.id}`}
            icon={item.done ? CheckCircle2 : item.kind === "quiz" ? HelpCircle : FileCode}
            label={item.kind === "quiz" ? t("quiz.title") : t("project.title")}
            sublabel={item.title}
            active={
              props.isActiveLesson &&
              (item.kind === "quiz"
                ? props.activeQuizId === item.id
                : props.activeProjectId === item.id)
            }
            done={item.done}
            statusBadge={activityStatusBadge(item, t)}
            lastSubmissionPercent={item.lastSubmissionPercent}
            onClick={() => {
              if (item.kind === "quiz") props.onOpenQuiz(item.id);
              else props.onOpenProject(item.id);
            }}
          />
        ))}
      </div>
    </details>
  );
}
