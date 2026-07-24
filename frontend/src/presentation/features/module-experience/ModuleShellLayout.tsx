import { Outlet } from "react-router-dom";
import { ModuleContentsDrawer } from "./components/ModuleContentsDrawer";

/** Module shell: side drawer + main column. Page (AppShell) scrolls; content grows with height. */
export function ModuleShellLayout() {
  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-0">
      <ModuleContentsDrawer />

      <div className="min-w-0 flex-1 border-border0 bg-surfacePanel lg:border lg:border-l-0 lg:rounded-r-panel">
        <Outlet />
      </div>
    </section>
  );
}
