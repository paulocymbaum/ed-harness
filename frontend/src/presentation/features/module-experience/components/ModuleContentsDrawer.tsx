import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon } from "../../../design-system";
import { useModuleUrlState } from "../../../../application/hooks/useModuleUrlState";
import { ModuleContentsNav } from "./drawer/ModuleContentsNav";

export function ModuleContentsDrawer() {
  const { t } = useTranslation();
  const { activeLessonId, activeQuizId, activeProjectId, drawerMode } = useModuleUrlState();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeLessonId, activeQuizId, activeProjectId, drawerMode]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2 lg:mb-0 lg:hidden">
        <p className="m-0 text-meta font-semibold text-text1">{t("module.contentsNav")}</p>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setMobileOpen((open) => !open)}
          title={mobileOpen ? t("module.contentsToggleHide") : t("module.contentsToggleShow")}
        >
          <Icon icon={mobileOpen ? PanelLeftClose : PanelLeftOpen} />
          {mobileOpen ? t("module.contentsHide") : t("module.contentsShow")}
        </Button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-x-0 bottom-0 top-12 z-[60] bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={clsx(
          "flex w-full shrink-0 flex-col border-border0 bg-surfacePanel",
          "lg:sticky lg:top-0 lg:z-auto lg:max-h-[calc(100dvh-5rem)] lg:w-80 lg:self-start lg:overflow-hidden lg:rounded-l-panel lg:border lg:border-r-0",
          mobileOpen
            ? "fixed bottom-0 left-0 top-12 z-[70] max-w-[min(100vw-1rem,20rem)] overflow-hidden rounded-panel border shadow-glass2 lg:static lg:inset-auto lg:shadow-none"
            : "hidden lg:flex",
        )}
      >
        <ModuleContentsNav />
      </aside>
    </>
  );
}
