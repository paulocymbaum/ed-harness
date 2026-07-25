import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon } from "../../../design-system";
import { useModuleUrlState } from "../../../../application/hooks/useModuleUrlState";
import { ModuleContentsNav } from "./drawer/ModuleContentsNav";

const STORAGE_KEY = "praxis.moduleContents.open";

function readInitialOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function ModuleContentsDrawer() {
  const { t } = useTranslation();
  const panelId = useId();
  const { activeLessonId, activeQuizId, activeProjectId, drawerMode } = useModuleUrlState();
  const [open, setOpen] = useState(readInitialOpen);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [open]);

  // On small screens, close after navigating so the lesson is readable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    setOpen(false);
  }, [activeLessonId, activeQuizId, activeProjectId, drawerMode]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {!open ? (
        <div className="pointer-events-none fixed bottom-4 left-3 z-[55]">
          <div className="group pointer-events-auto relative inline-flex">
            <button
              type="button"
              className={clsx(
                "inline-flex h-11 w-11 items-center justify-center rounded-full",
                "border border-border0 bg-surfaceControl text-text0 shadow-glass2",
                "opacity-70 transition duration-150 ease-out",
                "hover:opacity-100 hover:brightness-[1.06] hover:scale-105",
                "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/50",
                "active:scale-95",
              )}
              onClick={() => setOpen(true)}
              title={t("module.contentsToggleShow")}
              aria-label={t("module.contentsToggleShow")}
              aria-expanded={false}
              aria-controls={panelId}
            >
              <Icon icon={PanelLeftOpen} size={18} />
            </button>
            <span
              role="tooltip"
              className={clsx(
                "pointer-events-none absolute bottom-full left-0 z-10 mb-2",
                "whitespace-nowrap rounded-panel border border-border0 bg-surfaceModal px-2.5 py-1",
                "text-meta text-text0 shadow-glass2",
                "opacity-0 transition duration-150 ease-out",
                "group-hover:opacity-100 group-focus-within:opacity-100",
              )}
            >
              {t("module.contentsShow")}
            </span>
          </div>
        </div>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[1px]"
            aria-label={t("drawer.closeOverlay")}
            onClick={() => setOpen(false)}
          />

          <aside
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label={t("module.contentsAria")}
            className={clsx(
              "fixed bottom-0 left-0 top-12 z-[70] flex w-[min(100vw-1.5rem,20rem)] flex-col overflow-hidden",
              "rounded-r-panel border border-l-0 border-border0 bg-surfacePanel shadow-glass2",
              "isolate bg-clip-padding backdrop-blur-[var(--blur-2)]",
            )}
          >
            <div className="flex shrink-0 items-center justify-end gap-2 border-b border-border0 px-2 py-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                title={t("module.contentsToggleHide")}
                aria-label={t("module.contentsToggleHide")}
              >
                <Icon icon={PanelLeftClose} size={16} />
                <span className="text-meta">{t("module.contentsHide")}</span>
              </Button>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <ModuleContentsNav />
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
