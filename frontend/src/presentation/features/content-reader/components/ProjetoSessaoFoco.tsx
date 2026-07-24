import { useState } from "react";
import type { Project } from "../../../../domain/types/catalog";
import { useProjectDeliveryLiveSync } from "../../../../application/hooks/useProjectDeliveryLiveSync";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { markdownContextoProjeto } from "../../../../application/usecases/markdownContextoProjeto";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { TabPanel, Tabs } from "../../../design-system";
import { ReadmePanel } from "../../../shared/ReadmePanel";
import { LayoutFocoAtividade } from "../../lesson-workspace/components/LayoutFocoAtividade";
import { ProjectStatusBadge } from "../../course-experience/components/ProjectStatusBadge";
import { ProjectDeliveryPanel } from "./ProjectDeliveryPanel";

type AbaEsquerda = "contexto" | "licao";

export function ProjetoSessaoFoco(props: {
  courseId: string;
  courseTitle: string;
  project: Project;
  lessonMarkdown: string;
  lessonTitle: string;
  onVoltar: () => void;
}) {
  const { t } = useTranslation();
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);

  useProjectDeliveryLiveSync({
    courseId: props.courseId,
    projectId: props.project.id,
    rootPath: props.project.rootPath,
    lessonId: props.project.lessonId,
  });

  const contextoMarkdown = markdownContextoProjeto(props.project, props.project.entries, "");
  const hasContext = Boolean(contextoMarkdown.trim());
  const [abaEsquerda, setAbaEsquerda] = useState<AbaEsquerda>(hasContext ? "contexto" : "licao");

  const painelEsquerdo = (
    <Tabs
      value={hasContext ? abaEsquerda : "licao"}
      onValueChange={(v) => setAbaEsquerda(v as AbaEsquerda)}
      items={[
        ...(hasContext ? [{ value: "contexto", label: t("tabs.context") }] : []),
        { value: "licao", label: t("foco.abaLicao") },
      ]}
      ariaLabel={t("foco.abasContexto")}
      className="grid gap-4"
    >
      {hasContext ? (
        <TabPanel value="contexto" forceMount className="data-[state=active]:block">
          <div className="pt-2">
            <ReadmePanel markdown={contextoMarkdown} variant="inline" />
          </div>
        </TabPanel>
      ) : null}
      <TabPanel value="licao" forceMount className="data-[state=active]:block">
        <div className="pt-2">
          <ReadmePanel
            title={props.lessonTitle}
            markdown={props.lessonMarkdown}
            showTitle={false}
            variant="inline"
          />
        </div>
      </TabPanel>
    </Tabs>
  );

  const painelDireito = (
    <ProjectDeliveryPanel
      courseId={props.courseId}
      courseTitle={props.courseTitle}
      projectTitle={props.project.title}
      projectId={props.project.id}
      rootPath={props.project.rootPath}
      entries={props.project.entries}
      enabled
    />
  );

  return (
    <LayoutFocoAtividade
      titulo={props.project.title}
      onVoltar={props.onVoltar}
      chaveDivisor="edharness.foco.split.project"
      proporcaoInicial={0.4}
      rotuloEsquerdo={t("tabs.explanation")}
      rotuloDireito={t("tabs.delivery")}
      status={
        <ProjectStatusBadge
          value={getProjectStatus(props.courseId, props.project.id, props.project.lessonId)}
          showPoints
          size="sm"
        />
      }
      painelEsquerdo={painelEsquerdo}
      painelDireito={painelDireito}
    />
  );
}
