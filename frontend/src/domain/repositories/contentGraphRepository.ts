import type { ContentGraph } from "../types/contentGraph";

export interface ContentGraphRepository {
  listCourseSlugs(): Promise<string[]>;
  getContentGraph(courseId: string): Promise<ContentGraph | null>;
}
