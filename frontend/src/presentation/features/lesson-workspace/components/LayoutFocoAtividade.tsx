import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ArrowLeft } from "lucide-react";
import {
  calcularProporcaoDoPonteiro,
  useProporcaoDivisor,
} from "../../../../application/hooks/useProporcaoDivisor";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon, TabPanel, Tabs } from "../../../design-system";

export type AbaFocoMobile = "enunciado" | "resposta";

export function LayoutFocoAtividade(props: {
  titulo: string;
  onVoltar: () => void;
  chaveDivisor: string;
  painelEsquerdo: ReactNode;
  painelDireito: ReactNode;
  status?: ReactNode;
  proporcaoInicial?: number;
  rotuloEsquerdo?: string;
  rotuloDireito?: string;
}) {
  const { t } = useTranslation();
  const [proporcao, setProporcao] = useProporcaoDivisor(
    props.chaveDivisor,
    props.proporcaoInicial ?? 0.45,
  );
  const [abaMobile, setAbaMobile] = useState<AbaFocoMobile>("resposta");
  const [arrastando, setArrastando] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aoPonteiro = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      setProporcao(calcularProporcaoDoPonteiro(clientX, el.getBoundingClientRect()));
    },
    [setProporcao],
  );

  const iniciarArraste = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      setArrastando(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      aoPonteiro(event.clientX);
    },
    [aoPonteiro],
  );

  const moverArraste = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!arrastando) return;
      aoPonteiro(event.clientX);
    },
    [arrastando, aoPonteiro],
  );

  const terminarArraste = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    setArrastando(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const abasMobile = [
    { value: "enunciado", label: props.rotuloEsquerdo ?? t("foco.abaEnunciado") },
    { value: "resposta", label: props.rotuloDireito ?? t("foco.abaResposta") },
  ];

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-panel border border-border0 bg-surfacePanel">
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

      {/* Mobile: abas — painéis permanecem montados */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden">
        <Tabs
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          value={abaMobile}
          onValueChange={(v) => setAbaMobile(v as AbaFocoMobile)}
          items={abasMobile}
          ariaLabel={t("foco.abasMobile")}
          listClassName="shrink-0 border-b border-border0 px-3 py-2"
        >
          <TabPanel
            value="enunciado"
            forceMount
            className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
          >
            <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">{props.painelEsquerdo}</div>
          </TabPanel>
          <TabPanel
            value="resposta"
            forceMount
            className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{props.painelDireito}</div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Desktop: duas colunas com divisor */}
      <div
        ref={containerRef}
        className="hidden min-h-0 flex-1 overflow-hidden lg:flex"
      >
        <div
          className="min-h-0 min-w-0 overflow-auto border-r border-border0"
          style={{ flexBasis: `${proporcao * 100}%`, flexGrow: 0, flexShrink: 0 }}
        >
          <div className="p-4">{props.painelEsquerdo}</div>
        </div>

        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={t("foco.divisor")}
          aria-valuemin={25}
          aria-valuemax={75}
          aria-valuenow={Math.round(proporcao * 100)}
          tabIndex={0}
          className="group relative z-10 w-1.5 shrink-0 cursor-col-resize bg-border0 transition hover:bg-accent0/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60"
          onPointerDown={iniciarArraste}
          onPointerMove={moverArraste}
          onPointerUp={terminarArraste}
          onPointerCancel={terminarArraste}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setProporcao((p) => p - 0.03);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              setProporcao((p) => p + 0.03);
            }
          }}
        >
          <span className="pointer-events-none absolute inset-y-0 -left-1 -right-1" />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {props.painelDireito}
        </div>
      </div>
    </section>
  );
}
