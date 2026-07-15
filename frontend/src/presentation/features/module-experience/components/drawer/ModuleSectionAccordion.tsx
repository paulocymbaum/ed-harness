import clsx from "clsx";
import { ChevronDown, Layers } from "lucide-react";
import type { ReactNode } from "react";
import { formatScoreLabel } from "../../../../../domain/scoreProgress";
import { Icon } from "../../../../design-system";

export function ModuleSectionAccordion(props: {
  sectionKey: string;
  sectionLabel: string;
  scorePoints?: { value: number; max: number };
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const hasScore = (props.scorePoints?.max ?? 0) > 0;

  return (
    <details className="group mb-1" open={props.defaultOpen}>
      <summary
        className={clsx(
          "flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-panel px-2 py-2",
          "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
        )}
      >
        <Icon icon={Layers} size={14} className="shrink-0 text-text1" />
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-meta font-semibold text-accent0">{props.sectionKey}</span>
          <span className="block truncate text-meta text-text1">{props.sectionLabel}</span>
        </span>
        {hasScore && props.scorePoints ? (
          <span className="shrink-0 text-meta font-medium text-text0">
            {formatScoreLabel(props.scorePoints.value, props.scorePoints.max)}
          </span>
        ) : null}
        <Icon icon={ChevronDown} size={14} className="shrink-0 text-text1 transition group-open:rotate-180" />
      </summary>
      <div className="ml-2 grid gap-0.5 border-l border-border0 py-1 pl-2">{props.children}</div>
    </details>
  );
}
