import { useMemo } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useCatalog } from "../../application/hooks/useCatalog";
import { useCourseTabLabels } from "../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../application/hooks/useTranslation";
import {
  getCourseById,
  getLessonById,
  getModuleOrMockTestById,
  getProjectById,
  isHierarchyCourse,
} from "../../application/selectors/catalogSelectors";
import { getQuizById } from "../../application/selectors/quizSelectors";
import { useAppNavigation } from "../../application/hooks/useAppNavigation";
import type { CourseTab } from "../../domain/types/navigation";
import type { Course } from "../../domain/types/catalog";

export type PageChromeSegment = { label: string; onClick?: () => void };

export function usePageChrome() {
  const { courses } = useCatalog();
  const { t } = useTranslation();
  const tabLabels = useCourseTabLabels();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { goCatalog, goCourse, goModule, goLesson, goMockTest, parseCourseTab } =
    useAppNavigation();

  const courseId = params.courseId;
  const moduleId = params.moduleId;
  const lessonId = params.lessonId;
  const sectionId = params.sectionId;
  const quizIdParam = params.quizId;
  const projectIdParam = params.projectId;
  const isCourseRoute = location.pathname.startsWith("/course/");
  const isMockTestRoute = location.pathname.includes("/mock-test");
  const isFocoAtividade = Boolean(quizIdParam || projectIdParam);

  const course = useMemo(
    () => (courseId ? getCourseById(courses, courseId) : null),
    [courses, courseId],
  );

  const mod = useMemo(
    () => (course && moduleId ? getModuleOrMockTestById(course, moduleId) : null),
    [course, moduleId],
  );

  const lesson = useMemo(
    () => (course && moduleId && lessonId ? getLessonById(course, moduleId, lessonId) : null),
    [course, moduleId, lessonId],
  );

  const activeQuizId = quizIdParam ?? searchParams.get("quiz");
  const activeProjectId = projectIdParam ?? searchParams.get("project");

  const quiz = useMemo(() => {
    if (!course || !activeQuizId) return null;
    if (quizIdParam && lessonId && moduleId) {
      return getQuizById(course, activeQuizId, { moduleId, lessonId });
    }
    if (moduleId && !lessonId) {
      return getQuizById(course, activeQuizId, { moduleId });
    }
    if (lessonId && moduleId) {
      return getQuizById(course, activeQuizId, { moduleId, lessonId });
    }
    return getQuizById(course, activeQuizId);
  }, [course, activeQuizId, quizIdParam, lessonId, moduleId]);

  const project = useMemo(() => {
    if (!course || !moduleId || !activeProjectId) return null;
    return getProjectById(course, moduleId, activeProjectId);
  }, [course, moduleId, activeProjectId]);

  const tab = courseId ? parseCourseTab(searchParams.get("tab")) : null;

  const breadcrumbSegments = useMemo((): PageChromeSegment[] => {
    if (!isCourseRoute || !course) return [{ label: t("nav.catalog") }];

    const segments: PageChromeSegment[] = [
      { label: t("nav.catalog"), onClick: goCatalog },
      { label: course.title, onClick: () => goCourse(course.id) },
    ];

    if (mod) {
      const onMockTest = isMockTestRoute;
      segments.push({
        label: mod.title,
        onClick: onMockTest
          ? () => goMockTest(course.id, mod.id)
          : () => goModule(course.id, mod.id),
      });
    }

    if (isMockTestRoute && sectionId && mod) {
      const mockLesson = "lessons" in mod ? mod.lessons.find((l) => l.id === sectionId) : null;
      if (mockLesson) {
        segments.push({ label: mockLesson.title });
      }
    }

    if (lesson && moduleId) {
      segments.push({
        label: lesson.title,
        onClick: () => goLesson(course.id, moduleId, lesson.id),
      });
    }

    if (quiz) {
      segments.push({ label: quiz.title });
    } else if (project) {
      segments.push({ label: project.title });
    } else if (moduleId && activeQuizId && !lessonId) {
      const moduleQuiz = getQuizById(course, activeQuizId, { moduleId });
      if (moduleQuiz) segments.push({ label: moduleQuiz.title });
    }

    if (!isHierarchyCourse(course) && tab && tab !== "readme") {
      segments.push({ label: tabLabels[tab as CourseTab] });
    }

    return segments;
  }, [
    isCourseRoute,
    course,
    mod,
    lesson,
    quiz,
    project,
    moduleId,
    lessonId,
    activeQuizId,
    tab,
    tabLabels,
    t,
    goCatalog,
    goCourse,
    goModule,
    goLesson,
    goMockTest,
    isMockTestRoute,
    sectionId,
  ]);

  const pageTitle = useMemo(() => {
    if (!isCourseRoute || !course) return t("catalog.title");

    if (isMockTestRoute && sectionId && mod && "lessons" in mod) {
      const mockLesson = mod.lessons.find((l) => l.id === sectionId);
      if (mockLesson) return mockLesson.title;
    }

    if (quiz) return quiz.title;
    if (project) return project.title;
    if (moduleId && activeQuizId && !lessonId) {
      const moduleQuiz = getQuizById(course, activeQuizId, { moduleId });
      if (moduleQuiz) return moduleQuiz.title;
    }
    if (lesson) return lesson.title;
    if (mod) return mod.title;
    if (!isHierarchyCourse(course) && tab && tab !== "readme") {
      return tabLabels[tab as CourseTab];
    }
    return course.title;
  }, [
    isCourseRoute,
    course,
    isMockTestRoute,
    sectionId,
    mod,
    quiz,
    project,
    moduleId,
    activeQuizId,
    lessonId,
    lesson,
    tab,
    tabLabels,
    t,
  ]);

  return {
    course: course as Course | null,
    isCourseRoute,
    isMockTestRoute,
    isFocoAtividade,
    pageTitle,
    breadcrumbSegments,
  };
}
