import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const graphIndex = require("./graph-index.js");

export const {
  loadGraph,
  loadGraphFromPaths,
  resolveCourseMeta,
  resolveGraphSlug,
  resolveGraphPaths,
  listCourseSlugs,
  loadAllGraphs,
  courseSlugFromPath,
  normalize,
  extractIndexPath,
  stripIndexPrefix,
  normalizeLabelText,
  normalizeIndexPath,
  indexPathsEqual,
  labelsMatch,
  kebabCase,
  slugFromLabel,
  getModuleIndex,
  buildAdjacency,
  getChildren,
  isLeafNode,
  findNodeByIndex,
  getAncestorChain,
  getModuleNodeForIndex,
  getLeafDescendants,
  courseSlugFromRootLabel,
} = graphIndex;
