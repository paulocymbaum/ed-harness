const fs = require("fs");
const path = require("path");

const { parseMindmapText } = require("./parseMindmap");
const { bfs } = require("./utils/bfs");

function resolveCourseMeta(repoRoot, courseSlug) {
  const metaPath = path.join(repoRoot, "course", courseSlug, "course.meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function resolveGraphSlug(repoRoot, options = {}) {
  if (options.graphSlug) return options.graphSlug;
  if (options.courseSlug) {
    const meta = resolveCourseMeta(repoRoot, options.courseSlug);
    if (meta?.graphSlug) return meta.graphSlug;
    return options.courseSlug;
  }
  return null;
}

function resolveGraphPaths(options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const graphSlug = resolveGraphSlug(repoRoot, options);

  if (!graphSlug) {
    throw new Error(
      "resolveGraphPaths requires courseSlug or graphSlug (e.g. { courseSlug: \"javascript\" })",
    );
  }

  return {
    graphSlug,
    courseSlug: options.courseSlug ?? graphSlug,
    txtPath: path.join(repoRoot, "graph", "courses", `${graphSlug}.graph.txt`),
    jsonPath: path.join(repoRoot, "graph", "courses", `${graphSlug}.graph.json`),
  };
}

function loadGraphFromPaths(txtPath, jsonPath, preferJson = true) {
  if (preferJson && fs.existsSync(jsonPath)) {
    return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  }

  if (!fs.existsSync(txtPath)) {
    throw new Error(`Graph source not found: ${txtPath}`);
  }

  const txt = fs.readFileSync(txtPath, "utf8");
  const graph = parseMindmapText(txt);

  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(graph, null, 2), "utf8");

  return graph;
}

function loadGraph(options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const preferJson = options.preferJson !== false;

  if (options.txtPath || options.jsonPath) {
    if (!options.txtPath || !options.jsonPath) {
      throw new Error("loadGraph with explicit paths requires both txtPath and jsonPath");
    }
    const txtPath = path.isAbsolute(options.txtPath)
      ? options.txtPath
      : path.resolve(repoRoot, options.txtPath);
    const jsonPath = path.isAbsolute(options.jsonPath)
      ? options.jsonPath
      : path.resolve(repoRoot, options.jsonPath);
    return loadGraphFromPaths(txtPath, jsonPath, preferJson);
  }

  if (!options.courseSlug && !options.graphSlug) {
    throw new Error('loadGraph requires courseSlug or graphSlug (e.g. { courseSlug: "javascript" })');
  }

  const resolved = resolveGraphPaths({
    repoRoot,
    courseSlug: options.courseSlug,
    graphSlug: options.graphSlug,
  });

  return loadGraphFromPaths(resolved.txtPath, resolved.jsonPath, preferJson);
}

function listCourseSlugs(repoRoot) {
  const courseDir = path.join(repoRoot, "course");
  if (!fs.existsSync(courseDir)) return [];

  return fs
    .readdirSync(courseDir, { withFileTypes: true })
    .filter((ent) => ent.isDirectory())
    .map((ent) => ent.name)
    .filter((slug) => {
      const modulesPath = path.join(courseDir, slug, "modules");
      const meta = resolveCourseMeta(repoRoot, slug);
      return fs.existsSync(modulesPath) && meta && meta.graphSlug;
    })
    .sort();
}

function loadAllGraphs(repoRoot, options = {}) {
  const slugs = options.courseSlugs ?? listCourseSlugs(repoRoot);
  const out = new Map();
  for (const courseSlug of slugs) {
    out.set(courseSlug, loadGraph({ repoRoot, courseSlug, preferJson: options.preferJson }));
  }
  return out;
}

function courseSlugFromPath(absOrRelPath, repoRoot = process.cwd()) {
  const normalized = path.resolve(repoRoot, absOrRelPath).replace(/\\/g, "/");
  const marker = "/course/";
  const idx = normalized.indexOf(marker);
  if (idx === -1) return null;
  const rest = normalized.slice(idx + marker.length);
  const slug = rest.split("/").filter(Boolean)[0];
  return slug || null;
}

function normalize(s) {
  return String(s ?? "").trim().toLowerCase();
}

const INDEX_PREFIX_RE = /^(\d+(?:\.\d+)*)\s+(.*)$/;

function extractIndexPath(label) {
  const m = String(label ?? "")
    .trim()
    .match(/^(\d+(?:\.\d+)*)(?:\s|$)/);
  return m ? m[1] : null;
}

function stripIndexPrefix(label) {
  const m = String(label ?? "").trim().match(INDEX_PREFIX_RE);
  return m ? m[2].trim() : String(label ?? "").trim();
}

function normalizeLabelText(label) {
  return normalize(stripIndexPrefix(label));
}

function normalizeIndexPath(raw) {
  const parts = String(raw ?? "")
    .trim()
    .split(".")
    .filter(Boolean);
  if (!parts.length) return null;

  const normalized = [];
  for (let i = 0; i < parts.length; i += 1) {
    const n = Number(parts[i]);
    if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) return null;
    normalized.push(i === 0 ? String(n).padStart(2, "0") : String(n));
  }
  return normalized.join(".");
}

function indexPathsEqual(a, b) {
  const left = normalizeIndexPath(a);
  const right = normalizeIndexPath(b);
  return left != null && right != null && left === right;
}

function labelsMatch(nodeLabel, query) {
  return normalizeLabelText(nodeLabel) === normalizeLabelText(query);
}

function kebabCase(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function slugFromLabel(label) {
  const index = extractIndexPath(label);
  const text = stripIndexPrefix(label);
  const slug = kebabCase(text);
  return index ? `${index}-${slug}` : slug;
}

function getModuleIndex(graphIndex) {
  const normalized = normalizeIndexPath(graphIndex);
  if (!normalized) return null;
  return normalized.split(".")[0];
}

function buildAdjacency(graph) {
  const adj = new Map();
  for (const n of graph.nodes || []) adj.set(n.id, []);
  for (const e of graph.edges || []) {
    if (!adj.has(e.from)) adj.set(e.from, []);
    adj.get(e.from).push(e.to);
  }
  return adj;
}

function getChildren(graph, nodeId) {
  const adj = buildAdjacency(graph);
  return adj.get(nodeId) || [];
}

function isLeafNode(graph, nodeId) {
  return getChildren(graph, nodeId).length === 0;
}

function findNodeByIndex(graph, rawIndex) {
  const targetIndex = normalizeIndexPath(rawIndex);
  if (!targetIndex) return null;

  let found = null;
  bfs(graph, graph.rootId, {
    visit: (node) => {
      if (found) return;
      const nodeIndex = extractIndexPath(node.label);
      if (nodeIndex && indexPathsEqual(nodeIndex, targetIndex)) found = node;
    },
  });
  return found;
}

function getAncestorChain(graph, nodeId) {
  const parentByChild = new Map();
  for (const e of graph.edges || []) parentByChild.set(e.to, e.from);

  const chain = [];
  let current = nodeId;
  while (current) {
    const node = (graph.nodes || []).find((n) => n.id === current);
    if (node) chain.unshift(node);
    current = parentByChild.get(current) ?? null;
  }
  return chain;
}

function getModuleNodeForIndex(graph, graphIndex) {
  const moduleIndex = getModuleIndex(graphIndex);
  if (!moduleIndex) return null;
  return findNodeByIndex(graph, moduleIndex);
}

function getLeafDescendants(graph, startId) {
  const leaves = [];
  bfs(graph, startId, {
    visit: (node) => {
      if (isLeafNode(graph, node.id) && extractIndexPath(node.label)) {
        leaves.push(node);
      }
    },
  });
  return leaves.sort((a, b) => {
    const ai = extractIndexPath(a.label) || "";
    const bi = extractIndexPath(b.label) || "";
    return ai.localeCompare(bi, "en", { numeric: true });
  });
}

function courseSlugFromRootLabel(label) {
  return kebabCase(stripIndexPrefix(label) || label);
}

module.exports = {
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
};
