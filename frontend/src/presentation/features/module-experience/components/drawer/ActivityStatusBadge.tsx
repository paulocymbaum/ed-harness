import clsx from "clsx";

export type ActivityStatusTone = "neutral" | "doing" | "done";

export function ActivityStatusBadge(props: {
  label: string;
  tone: ActivityStatusTone;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center rounded-panel border px-1.5 py-0.5 text-[0.65rem] font-medium leading-none",
        props.tone === "done" && "border-successBorder bg-successFill text-successText",
        props.tone === "doing" && "border-accent0/40 bg-surfaceAccent text-accent0",
        props.tone === "neutral" && "border-border0 bg-surfaceMuted text-text2",
      )}
    >
      {props.label}
    </span>
  );
}
