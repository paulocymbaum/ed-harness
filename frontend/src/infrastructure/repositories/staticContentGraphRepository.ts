import type { ContentGraphRepository } from "../../domain/repositories/contentGraphRepository";
import type { ContentGraph, ContentGraphsBundle } from "../../domain/types/contentGraph";
import contentGraphsJson from "../static/content-graphs.json";

const bundle = contentGraphsJson as ContentGraphsBundle;

export const staticContentGraphRepository: ContentGraphRepository = {
  listCourseSlugs: async (): Promise<string[]> => Object.keys(bundle.courses ?? {}).sort(),

  getContentGraph: async (courseId: string): Promise<ContentGraph | null> => {
    const graph = bundle.courses?.[courseId];
    return graph ?? null;
  },
};
