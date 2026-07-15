import { useCallback, useEffect, useState } from "react";
import type { ContentGraph } from "../../domain/types/contentGraph";
import { staticContentGraphRepository } from "../../infrastructure/repositories/staticContentGraphRepository";

type Status = "idle" | "loading" | "ready" | "error";

export function useContentGraph(courseId: string | null) {
  const [status, setStatus] = useState<Status>("idle");
  const [graph, setGraph] = useState<ContentGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseSlugs, setCourseSlugs] = useState<string[]>([]);

  const reload = useCallback(async () => {
    if (!courseId) {
      setGraph(null);
      setError(null);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      const [slugs, data] = await Promise.all([
        staticContentGraphRepository.listCourseSlugs(),
        staticContentGraphRepository.getContentGraph(courseId),
      ]);
      setCourseSlugs(slugs);
      if (!data) {
        setGraph(null);
        setError(`No content graph for course "${courseId}"`);
        setStatus("error");
        return;
      }
      setGraph(data);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [courseId]);

  useEffect(() => {
    void staticContentGraphRepository.listCourseSlugs().then(setCourseSlugs);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { status, graph, error, reload, courseSlugs };
}
