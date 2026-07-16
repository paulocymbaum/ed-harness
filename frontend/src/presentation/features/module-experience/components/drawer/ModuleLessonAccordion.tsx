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
import { Icon } from "../../../../design-system";
import { ScoreProgressRow } from "../../../../shared/score";
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
  onOpenLesson: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const { t } = useTranslation();
  const displayIndex = getLessonDisplayIndex(props.lesson);
  const hasScore = (props.scorePoints?.max ?? 0) > 0;

  return (
    <details className="group" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex cursor-pointer list-none flex-col gap-1.5 rounded-panel px-2 py-1.5",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
          props.isActiveLesson && "bg-surfaceAccent",
        )}
      >
        <div className="flex min-h-7 items-center gap-2">
          <span className="w-12 shrink-0 font-mono text-meta text-text2">{displayIndex}</span>
          <span className="min-w-0 flex-1 truncate text-meta font-medium text-text0">
            {props.lesson.title}
          </span>
          <Icon
            icon={ChevronDown}
            size={14}
            className="shrink-0 text-text1 transition group-open:rotate-180"
          />
        </div>
        {hasScore && props.scorePoints ? (
          <div
            className="pl-14 pr-6"
            onClick={(event) => event.stopPropagation()}
          >
            <ScoreProgressRow
              label={t("lesson.score")}
              metric={props.scorePoints}
              size="xs"
            />
          </div>
        ) : null}
      </summary>

      <div className="grid gap-0.5 py-1 pl-3">
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
