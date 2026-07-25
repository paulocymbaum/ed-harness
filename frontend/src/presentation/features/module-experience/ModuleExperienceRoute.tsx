import { FileText } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { getModuleDisplayIndex } from "../../../application/selectors/lessonDisplay";
import { Button } from "../../design-system";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { ModuleMainPanel } from "./components/ModuleMainPanel";
import { useModuleLayoutContext } from "./ModuleLayoutContext";

export function ModuleExperienceRoute() {
  const { t } = useTranslation();
  const { courseId, moduleId, module: mod } = useModuleLayoutContext();
  const { goLesson } = useAppNavigation();

  const showReadme = hasDisplayableReadme(mod.readmeMarkdown, mod.title);
  const moduleIndex = getModuleDisplayIndex(mod);
  const firstLesson = mod.lessons[0];

  return (
    <ModuleMainPanel
      meta={t("module.contextMeta")}
      indexLabel={moduleIndex}
      title={t("module.contextTitle")}
      subtitle={mod.title}
      icon={FileText}
    >
      {showReadme ? (
        <ReadmePanel markdown={mod.readmeMarkdown} title={mod.title} variant="inline" />
      ) : (
        <p className="m-0 text-body text-text1">{t("module.pickLesson")}</p>
      )}

      {firstLesson ? (
        <section className="mt-6 rounded-panel border border-border0 bg-surfacePanel p-4">
          <h2 className="m-0 mb-3 text-body font-semibold text-text0">{t("module.nextSteps")}</h2>
          <Button
            variant="primary"
            size="md"
            onClick={() => goLesson(courseId, moduleId, firstLesson.id)}
          >
            {t("module.openFirstLesson")}
          </Button>
        </section>
      ) : null}
    </ModuleMainPanel>
  );
}
