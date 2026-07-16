import clsx from "clsx";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button } from "../Button";
import { Icon } from "../../icons/Icon";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true",
  );
}

function useIsNarrowViewport(): boolean {
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 1023px)").matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const onChange = () => setIsNarrow(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isNarrow;
}

export function Drawer(props: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isNarrow = useIsNarrowViewport();
  const onCloseRef = useRef(props.onClose);
  onCloseRef.current = props.onClose;

  useEffect(() => {
    if (!props.open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTarget = closeButtonRef.current ?? panelRef.current;
    focusTarget?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [props.open]);

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !panelRef.current || !isNarrow) return;

    const focusable = getFocusableElements(panelRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      panelRef.current.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!props.open) return null;

  return (
    <>
      <button
        type="button"
        aria-label={t("drawer.closeOverlay")}
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={props.onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal={isNarrow || undefined}
        aria-labelledby={props.title ? titleId : undefined}
        tabIndex={-1}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-sheet border border-border0 bg-surfaceModal shadow-glass2 outline-none",
          "lg:static lg:inset-auto lg:max-h-none lg:w-[min(480px,40vw)] lg:shrink-0 lg:rounded-panel lg:border-l lg:border-t-0",
          props.className,
        )}
        onKeyDown={onPanelKeyDown}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border0 px-4 py-3">
          {props.title ? (
            <div id={titleId} className="truncate text-body font-semibold text-text0">
              {props.title}
            </div>
          ) : (
            <div />
          )}
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="md"
            onClick={props.onClose}
            title={t("drawer.close")}
            aria-label={t("drawer.close")}
          >
            <Icon icon={X} />
            <span className="lg:hidden">{t("drawer.backToExplanation")}</span>
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{props.children}</div>
      </aside>
    </>
  );
}
