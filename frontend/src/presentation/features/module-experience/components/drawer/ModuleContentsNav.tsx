import { useMemo } from "react";
import { FileText } from "lucide-react";
import type { Course, Lesson } from "../../../../../domain/types/catalog";
import {
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../../../application/selectors/catalogSelectors";
import {
  getModuleDisplayIndex,
  groupLessonsBySection,
  isFlatLessonSection,
} from "../../../../../application/selectors/lessonDisplay";
import { useLessonActivityItems } from "../../../../../application/hooks/useLessonActivityItems";
import { useLessonScore } from "../../../../../application/hooks/useLessonScore";
import { useSectionScore } from "../../../../../application/hooks/useSectionScore";
import { useTranslation } from "../../../../../application/hooks/useTranslation";
import { useModuleLayoutContext } from "../../ModuleLayoutContext";
import { useModuleContentsNavigation } from "../../hooks/useModuleContentsNavigation";
import { useModuleUrlState } from "../../../../../application/hooks/useModuleUrlState";
import { ModulePanelHeader } from "../ModulePanelHeader";
import { ModuleLessonAccordion } from "./ModuleLessonAccordion";
import { ModuleSectionAccordion } from "./ModuleSectionAccordion";

export function ModuleContentsNav() {
  const { t } = useTranslation();
  const { courseId, moduleId, course, module: mod } = useModuleLayoutContext();
  const navigation = useModuleContentsNavigation();
  const { activeLessonId, activeQuizId, activeProjectId, isModuleContextActive } =
    useModuleUrlState();

  const lessonSections = useMemo(() => groupLessonsBySection(mod.lessons), [mod.lessons]);
  const moduleIndex = getModuleDisplayIndex(mod);

  return (
    <nav className="flex min-h-0 min-w-0 flex-1 flex-col" aria-label={t("module.contentsAria")}>
      <ModulePanelHeader
        meta={t("module.contentsMeta")}
        indexLabel={moduleIndex}
        title={t("module.contextTitle")}
        subtitle={mod.title}
        icon={FileText}
        active={isModuleContextActive}
        onClick={navigation.openModuleContext}
      />

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-2">
        {lessonSections.map((section) => {
          const flat = isFlatLessonSection(section);
          const lesson = section.lessons[0];

          if (flat && lesson) {
            return (
              <ModuleLessonNavItem
                key={lesson.id}
                courseId={courseId}
                moduleId={moduleId}
                course={course}
                lesson={lesson}
                isActiveLesson={lesson.id === activeLessonId}
                activeQuizId={lesson.id === activeLessonId ? activeQuizId : null}
                activeProjectId={lesson.id === activeLessonId ? activeProjectId : null}
                defaultOpen={
                  lesson.id === activeLessonId ||
                  section.sectionKey === lessonSections[0]?.sectionKey
                }
                onOpenLesson={() => navigation.openLesson(lesson.id)}
                onOpenQuiz={(quizId) => navigation.openLessonQuiz(lesson.id, quizId)}
                onOpenProject={(projectId) =>
                  navigation.openLessonProject(lesson.id, projectId)
                }
              />
            );
          }

          return (
            <ModuleSectionNavItem
              key={section.sectionKey}
              courseId={courseId}
              moduleId={moduleId}
              course={course}
              sectionKey={section.sectionKey}
              sectionLabel={section.sectionLabel}
              lessons={section.lessons}
              activeLessonId={activeLessonId}
              activeQuizId={activeQuizId}
              activeProjectId={activeProjectId}
              defaultOpen={
                section.lessons.some((item) => item.id === activeLessonId) ||
                section.sectionKey === lessonSections[0]?.sectionKey
              }
              onOpenLesson={(lessonId) => navigation.openLesson(lessonId)}
              onOpenQuiz={(lessonId, quizId) => navigation.openLessonQuiz(lessonId, quizId)}
              onOpenProject={(lessonId, projectId) =>
                navigation.openLessonProject(lessonId, projectId)
              }
            />
          );
        })}
      </div>
    </nav>
  );
}

function ModuleSectionNavItem(props: {
  courseId: string;
  moduleId: string;
  course: Course;
  sectionKey: string;
  sectionLabel: string;
  lessons: Lesson[];
  activeLessonId: string | null;
  activeQuizId: string | null;
  activeProjectId: string | null;
  defaultOpen?: boolean;
  onOpenLesson: (lessonId: string) => void;
  onOpenQuiz: (lessonId: string, quizId: string) => void;
  onOpenProject: (lessonId: string, projectId: string) => void;
}) {
  const sectionScore = useSectionScore({
    course: props.course,
    moduleId: props.moduleId,
    lessons: props.lessons,
  });

  return (
    <ModuleSectionAccordion
      sectionKey={props.sectionKey}
      sectionLabel={props.sectionLabel}
      scorePoints={sectionScore?.points}
      defaultOpen={props.defaultOpen}
    >
      {props.lessons.map((lesson) => (
        <ModuleLessonNavItem
          key={lesson.id}
          courseId={props.courseId}
          moduleId={props.moduleId}
          course={props.course}
          lesson={lesson}
          isActiveLesson={lesson.id === props.activeLessonId}
          activeQuizId={lesson.id === props.activeLessonId ? props.activeQuizId : null}
          activeProjectId={lesson.id === props.activeLessonId ? props.activeProjectId : null}
          defaultOpen={lesson.id === props.activeLessonId}
          hideIndex={false}
          onOpenLesson={() => props.onOpenLesson(lesson.id)}
          onOpenQuiz={(quizId) => props.onOpenQuiz(lesson.id, quizId)}
          onOpenProject={(projectId) => props.onOpenProject(lesson.id, projectId)}
        />
      ))}
    </ModuleSectionAccordion>
  );
}

function ModuleLessonNavItem(props: {
  courseId: string;
  moduleId: string;
  course: Course;
  lesson: Lesson;
  isActiveLesson: boolean;
  activeQuizId: string | null;
  activeProjectId: string | null;
  defaultOpen?: boolean;
  hideIndex?: boolean;
  onOpenLesson: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const quizzes = getQuizzesForLesson(props.course, props.moduleId, props.lesson.id);
  const projects = getProjectsForLesson(props.course, props.moduleId, props.lesson.id);
  const items = useLessonActivityItems({
    courseId: props.courseId,
    lessonId: props.lesson.id,
    quizzes,
    projects,
  });
  const lessonScore = useLessonScore({
    course: props.course,
    moduleId: props.moduleId,
    lessonId: props.lesson.id,
  });

  return (
    <ModuleLessonAccordion
      lesson={props.lesson}
      items={items}
      scorePoints={lessonScore.points}
      isActiveLesson={props.isActiveLesson}
      activeQuizId={props.activeQuizId}
      activeProjectId={props.activeProjectId}
      defaultOpen={props.defaultOpen}
      hideIndex={props.hideIndex}
      onOpenLesson={props.onOpenLesson}
      onOpenQuiz={props.onOpenQuiz}
      onOpenProject={props.onOpenProject}
    />
  );
}
