import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Accordion, Button, Icon } from "../../../design-system";

/**
 * Focus layout for quiz/project: activity (quiz or delivery) on top,
 * lesson explanation collapsed below in an accordion.
 */
export function LayoutFocoAtividade(props: {
  titulo: string;
  onVoltar: () => void;
  /** @deprecated Kept for call-site compatibility; split pane removed in favor of page scroll. */
  chaveDivisor?: string;
  painelEsquerdo: ReactNode;
  painelDireito: ReactNode;
  status?: ReactNode;
  /** @deprecated Kept for call-site compatibility. */
  proporcaoInicial?: number;
  rotuloEsquerdo?: string;
  /** @deprecated Mobile tabs removed; kept for call-site compatibility. */
  rotuloDireito?: string;
}) {
  const { t } = useTranslation();
  const rotuloExplicacao = props.rotuloEsquerdo ?? t("tabs.explanation");

  return (
    <section className="flex flex-col rounded-panel border border-border0 bg-surfacePanel">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border0 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Button variant="ghost" size="md" onClick={props.onVoltar}>
            <Icon icon={ArrowLeft} />
            {t("foco.voltarLicao")}
          </Button>
          <div className="truncate text-meta font-semibold text-text0">{props.titulo}</div>
        </div>
        {props.status ? <div className="shrink-0">{props.status}</div> : null}
      </div>

      <div className="flex flex-col">
        <div className="border-b border-border0 p-3 sm:p-4">{props.painelDireito}</div>
        <div className="p-3 sm:p-4">
          <Accordion
            title={<span className="text-body font-medium text-text0">{rotuloExplicacao}</span>}
          >
            {props.painelEsquerdo}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
