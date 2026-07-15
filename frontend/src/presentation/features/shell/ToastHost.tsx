import clsx from "clsx";
import { useToastStore } from "../../../application/stores/toastStore";

export function ToastHost() {
  const message = useToastStore((s) => s.message);
  const tone = useToastStore((s) => s.tone);
  const clear = useToastStore((s) => s.clear);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:bottom-6"
    >
      <div
        className={clsx(
          "pointer-events-auto flex max-w-md items-start gap-3 rounded-panel border px-4 py-3 shadow-glass2",
          tone === "success" && "border-successBorder bg-successFill text-successText",
          tone === "error" && "border-dangerBorder bg-dangerFill text-dangerText",
          tone === "info" && "border-border0 bg-surfaceModal text-text0",
        )}
      >
        <p className="m-0 flex-1 text-body">{message}</p>
        <button
          type="button"
          className="shrink-0 text-meta underline-offset-2 hover:underline"
          onClick={clear}
        >
          ×
        </button>
      </div>
    </div>
  );
}
