import { Outlet } from "react-router-dom";
import { ModuleContentsDrawer } from "./components/ModuleContentsDrawer";

/** Module shell: full-width main column; contents drawer overlays from the left. */
export function ModuleShellLayout() {
  return (
    <section className="relative">
      <ModuleContentsDrawer />

      <div className="min-w-0 overflow-hidden rounded-panel border border-border0 bg-surfacePanel bg-clip-padding backdrop-blur-[var(--blur-2)]">
        <Outlet />
      </div>
    </section>
  );
}
