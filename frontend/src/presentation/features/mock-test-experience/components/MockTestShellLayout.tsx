import { Outlet } from "react-router-dom";
import { MockTestSectionNav } from "./MockTestSectionNav";
import { useMockTestLayoutContext } from "../MockTestLayoutContext";

export function MockTestShellLayout() {
  const ctx = useMockTestLayoutContext();

  return (
    <section className="grid gap-4">
      <div className="flex min-h-[70vh] flex-col lg:flex-row lg:items-stretch">
        <aside className="flex w-full shrink-0 flex-col overflow-hidden border-border0 bg-surfacePanel lg:w-72 lg:rounded-l-panel lg:border lg:border-r-0">
          <MockTestSectionNav courseId={ctx.courseId} mockTest={ctx.mockTest} />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border0 bg-surfacePanel lg:border lg:border-l-0 lg:rounded-r-panel">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
