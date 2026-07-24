import { useParams } from "react-router-dom";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import {
  getLessonById,
  getProjectsForLesson,
} from "../../../application/selectors/catalogSelectors";
import { ErrorPanel } from "../../design-system";
import { ProjetoSessaoFoco } from "../content-reader/components/ProjetoSessaoFoco";
import { useModuleLayoutContext } from "../module-experience/ModuleLayoutContext";

export function RotaProjetoLicao() {
  const { t } = useTranslation();
  const { courseId, moduleId, course } = useModuleLayoutContext();
  const { lessonId = "", projectId = "" } = useParams();
  const { voltarParaLicao } = useAppNavigation();

  const lesson = getLessonById(course, moduleId, lessonId);
  if (!lesson) {
    return <ErrorPanel title={t("error.lessonNotFound")} />;
  }

  const lessonProjects = getProjectsForLesson(course, moduleId, lessonId);
  const project = lessonProjects.find((p) => p.id === projectId) ?? null;
  if (!project) {
    return <ErrorPanel title={t("error.projectNotFound")} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <ProjetoSessaoFoco
        courseId={courseId}
        courseTitle={course.title}
        project={project}
        lessonMarkdown={lesson.markdown}
        lessonTitle={lesson.title}
        onVoltar={() => voltarParaLicao(courseId, moduleId, lessonId)}
      />
    </div>
  );
}
