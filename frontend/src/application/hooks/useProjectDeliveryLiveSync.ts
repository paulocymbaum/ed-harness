import { useEffect } from "react";
import { loadProjectDeliveries } from "../usecases/projectDeliveries";

/** Matches `PROJECT_DELIVERY_UPDATED_EVENT` in vite-project-delivery-plugin.mjs */
const PROJECT_DELIVERY_UPDATED_EVENT = "project-delivery:updated";

type DeliveryUpdatedPayload = {
  rootPath?: string;
};

/**
 * Reloads deliveries when project-delivery.json changes on disk
 * (e.g. save-project-review.mjs) via the Vite HMR websocket.
 */
export function useProjectDeliveryLiveSync(input: {
  courseId: string;
  projectId: string;
  rootPath: string;
  lessonId?: string;
}): void {
  const { courseId, projectId, rootPath, lessonId } = input;

  useEffect(() => {
    if (!courseId || !projectId || !rootPath) return;

    // Registers Vite file watch via GET and keeps store warm while the project is open.
    void loadProjectDeliveries(courseId, projectId, rootPath, lessonId, { quiet: true });

    const hot = import.meta.hot;
    if (!hot) return;

    const onUpdate = (data: DeliveryUpdatedPayload) => {
      const updatedRoot = typeof data?.rootPath === "string" ? data.rootPath.replace(/\\/g, "/") : "";
      if (!updatedRoot || updatedRoot !== rootPath.replace(/\\/g, "/")) return;
      void loadProjectDeliveries(courseId, projectId, rootPath, lessonId, { quiet: true });
    };

    hot.on(PROJECT_DELIVERY_UPDATED_EVENT, onUpdate);
    return () => {
      hot.off(PROJECT_DELIVERY_UPDATED_EVENT, onUpdate);
    };
  }, [courseId, projectId, rootPath, lessonId]);
}
