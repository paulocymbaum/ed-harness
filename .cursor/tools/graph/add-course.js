#!/usr/bin/env node
/**
 * Deterministically register a new course in the EdHarness graph + disk layout.
 *
 * Writes exact structures required by COURSE_STRUCTURE.md / docs/meta-schemas.md:
 *   - graph/courses/<slug>.graph.txt   (Mermaid mindmap source of truth)
 *   - graph/courses/<slug>.graph.json  (rendered)
 *   - course/<slug>/course.meta.json
 *   - course/<slug>/README.md
 *   - course/<slug>/modules/           (empty dir so listCourseSlugs discovers it)
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { kebabCase, normalizeIndexPath } = require("../../../scripts/graph/graph-index.js");

const repoRoot = path.resolve(__dirname, "../../..");

function usage() {
  return [
    "Usage:",
    "  node .cursor/tools/graph/add-course.js --slug <slug> --title <Title> [--outline <file.json>] [--dry-run] [--force] [--regenerate]",
    "",
    "Required:",
    "  --slug <slug>     Course folder / graphSlug (kebab-case)",
    "  --title <Title>   Human title + mindmap root label",
    "",
    "Optional:",
    "  --outline <file>  JSON outline of modules/sections/lessons (see skill reference)",
    "  --dry-run         Print planned writes; do not touch disk",
    "  --force           Overwrite existing graph/meta if present",
    "  --regenerate      After write, run render + generate-content-graph + generate-content-map",
    "",
    "Examples:",
    '  node .cursor/tools/graph/add-course.js --slug typescript --title "TypeScript" --dry-run',
    '  node .cursor/tools/graph/add-course.js --slug typescript --title "TypeScript" --outline outline.json --regenerate',
  ].join("\n");
}

function parseArgs(argv = process.argv.slice(2)) {
  const out = {
    slug: null,
    title: null,
    outline: null,
    dryRun: false,
    force: false,
    regenerate: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? null;
    else if (a === "--title") out.title = argv[++i] ?? null;
    else if (a === "--outline") out.outline = argv[++i] ?? null;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--force") out.force = true;
    else if (a === "--regenerate") out.regenerate = true;
    else if (a === "-h" || a === "--help") out.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }

  return out;
}

/** Canonical index: first segment zero-padded (`01.1.1`), matching graph-index.normalizeIndexPath. */
function normalizeIndex(index, depth) {
  const raw = String(index ?? "").trim();
  if (!raw) return null;
  const normalized = normalizeIndexPath(raw);
  if (!normalized) {
    throw new Error(`Invalid index "${raw}"`);
  }
  const parts = normalized.split(".");
  if (parts.length !== depth) {
    throw new Error(
      `Index "${raw}" has ${parts.length} segment(s); expected ${depth} (module=1, section=2, lesson=3)`,
    );
  }
  return normalized;
}

function assertValidSlug(slug) {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid slug "${slug}": use kebab-case (e.g. typescript, data-structures)`);
  }
}

function loadOutline(filePath) {
  if (!filePath) {
    return { modules: [] };
  }
  const abs = path.resolve(repoRoot, filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Outline not found: ${path.relative(repoRoot, abs)}`);
  }
  const data = JSON.parse(fs.readFileSync(abs, "utf8"));
  if (data == null || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Outline must be a JSON object");
  }
  return data;
}

/**
 * Normalize outline into a strict tree with padded indexes.
 * Accepts either explicit indexes or auto-numbers by array order.
 */
function normalizeOutlineTree(outline, title) {
  const modulesIn = Array.isArray(outline.modules) ? outline.modules : [];
  const modules = modulesIn.map((mod, mi) => {
    const moduleIndex = normalizeIndex(mod.index ?? String(mi + 1), 1);
    const moduleTitle = String(mod.title ?? mod.label ?? "").trim();
    if (!moduleTitle) throw new Error(`Module at ${moduleIndex} is missing title`);

    const sectionsIn = Array.isArray(mod.sections) ? mod.sections : [];
    const sections = sectionsIn.map((sec, si) => {
      const sectionIndex = normalizeIndex(sec.index ?? `${moduleIndex}.${si + 1}`, 2);
      if (!sectionIndex.startsWith(`${moduleIndex}.`)) {
        throw new Error(`Section ${sectionIndex} is not under module ${moduleIndex}`);
      }
      const sectionTitle = String(sec.title ?? sec.label ?? "").trim();
      if (!sectionTitle) throw new Error(`Section at ${sectionIndex} is missing title`);

      const lessonsIn = Array.isArray(sec.lessons) ? sec.lessons : [];
      const lessons = lessonsIn.map((les, li) => {
        const lessonIndex = normalizeIndex(les.index ?? `${sectionIndex}.${li + 1}`, 3);
        if (!lessonIndex.startsWith(`${sectionIndex}.`)) {
          throw new Error(`Lesson ${lessonIndex} is not under section ${sectionIndex}`);
        }
        const lessonTitle = String(les.title ?? les.label ?? "").trim();
        if (!lessonTitle) throw new Error(`Lesson at ${lessonIndex} is missing title`);
        return { index: lessonIndex, title: lessonTitle };
      });

      return { index: sectionIndex, title: sectionTitle, lessons };
    });

    return { index: moduleIndex, title: moduleTitle, sections };
  });

  return {
    title: String(outline.title ?? title).trim(),
    modules,
  };
}

function buildMindmapText(rootTitle, modules) {
  const lines = ["mindmap", `  root((${rootTitle}))`];
  for (const mod of modules) {
    lines.push(`    ${mod.index} ${mod.title}`);
    for (const sec of mod.sections) {
      lines.push(`      ${sec.index} ${sec.title}`);
      for (const les of sec.lessons) {
        lines.push(`        ${les.index} ${les.title}`);
      }
    }
  }
  return `${lines.join("\n")}\n`;
}

function buildCourseMeta({ slug, title, graphRootLabel }) {
  return {
    id: slug,
    title,
    graphRootLabel,
    graphSlug: slug,
  };
}

function buildCourseReadme(title) {
  return [`# ${title}`, "", "## Overview", "", "## Modules", "", "## How to study", "", ""].join(
    "\n",
  );
}

function pathsFor(slug) {
  return {
    graphTxt: path.join(repoRoot, "graph", "courses", `${slug}.graph.txt`),
    graphJson: path.join(repoRoot, "graph", "courses", `${slug}.graph.json`),
    courseDir: path.join(repoRoot, "course", slug),
    courseMeta: path.join(repoRoot, "course", slug, "course.meta.json"),
    courseReadme: path.join(repoRoot, "course", slug, "README.md"),
    modulesDir: path.join(repoRoot, "course", slug, "modules"),
  };
}

function ensureWritable(filePath, force) {
  if (fs.existsSync(filePath) && !force) {
    throw new Error(
      `Refusing to overwrite existing file: ${path.relative(repoRoot, filePath)} (pass --force)`,
    );
  }
}

function writeText(filePath, contents, dryRun) {
  const rel = path.relative(repoRoot, filePath);
  if (dryRun) {
    process.stdout.write(`DRY_RUN write ${rel} (${contents.length} bytes)\n`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
  process.stdout.write(`Wrote ${rel}\n`);
}

function ensureDir(dirPath, dryRun) {
  const rel = path.relative(repoRoot, dirPath);
  if (dryRun) {
    process.stdout.write(`DRY_RUN mkdir ${rel}\n`);
    return;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  process.stdout.write(`Ensured ${rel}/\n`);
}

function renderGraphJson(graphTxt, graphJson, dryRun) {
  if (dryRun) {
    process.stdout.write(
      `DRY_RUN render ${path.relative(repoRoot, graphTxt)} → ${path.relative(repoRoot, graphJson)}\n`,
    );
    return;
  }
  const script = path.join(repoRoot, "scripts/graph/renderTxtToJson.js");
  const result = spawnSync(process.execPath, [script, graphTxt, graphJson], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || "renderTxtToJson failed\n");
    throw new Error("Failed to render graph JSON");
  }
  process.stdout.write(`Wrote ${path.relative(repoRoot, graphJson)}\n`);
}

function regenerateArtifacts(dryRun) {
  const cmds = [
    ["scripts/graph/generate-content-graph.mjs"],
    ["scripts/graph/generate-content-map.mjs"],
  ];
  for (const [script] of cmds) {
    if (dryRun) {
      process.stdout.write(`DRY_RUN node ${script}\n`);
      continue;
    }
    const result = spawnSync(process.execPath, [path.join(repoRoot, script)], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.status !== 0) {
      process.stderr.write(result.stderr || `Failed: ${script}\n`);
      throw new Error(`Regenerate failed: ${script}`);
    }
  }
}

function main() {
  let args;
  try {
    args = parseArgs();
  } catch (err) {
    process.stderr.write(`${err.message}\n\n${usage()}\n`);
    process.exit(2);
  }

  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (!args.slug || !args.title) {
    process.stderr.write(`${usage()}\n`);
    process.exit(2);
  }

  try {
    assertValidSlug(args.slug);
    const title = String(args.title).trim();
    if (!title) throw new Error("--title must be non-empty");

    const expectedSlug = kebabCase(title);
    if (args.slug !== expectedSlug) {
      process.stdout.write(
        `NOTE: slug "${args.slug}" differs from kebabCase(title)="${expectedSlug}" (allowed)\n`,
      );
    }

    const outlineRaw = loadOutline(args.outline);
    if (outlineRaw.slug && outlineRaw.slug !== args.slug) {
      throw new Error(`Outline slug "${outlineRaw.slug}" does not match --slug "${args.slug}"`);
    }

    const tree = normalizeOutlineTree(outlineRaw, title);
    const mindmap = buildMindmapText(tree.title, tree.modules);
    const meta = buildCourseMeta({
      slug: args.slug,
      title,
      graphRootLabel: tree.title,
    });
    const readme = buildCourseReadme(title);
    const paths = pathsFor(args.slug);

    ensureWritable(paths.graphTxt, args.force);
    ensureWritable(paths.courseMeta, args.force);

    const plan = {
      slug: args.slug,
      title,
      graphRootLabel: meta.graphRootLabel,
      graphSlug: meta.graphSlug,
      moduleCount: tree.modules.length,
      lessonCount: tree.modules.reduce(
        (n, m) => n + m.sections.reduce((s, sec) => s + sec.lessons.length, 0),
        0,
      ),
      files: [
        path.relative(repoRoot, paths.graphTxt),
        path.relative(repoRoot, paths.graphJson),
        path.relative(repoRoot, paths.courseMeta),
        path.relative(repoRoot, paths.courseReadme),
        path.relative(repoRoot, paths.modulesDir) + "/",
      ],
      courseMeta: meta,
    };

    process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);

    writeText(paths.graphTxt, mindmap, args.dryRun);
    renderGraphJson(paths.graphTxt, paths.graphJson, args.dryRun);
    writeText(paths.courseMeta, `${JSON.stringify(meta, null, 2)}\n`, args.dryRun);
    if (!fs.existsSync(paths.courseReadme) || args.force) {
      writeText(paths.courseReadme, readme, args.dryRun);
    } else if (!args.dryRun) {
      process.stdout.write(`Kept existing ${path.relative(repoRoot, paths.courseReadme)}\n`);
    }
    ensureDir(paths.modulesDir, args.dryRun);

    if (args.regenerate) {
      regenerateArtifacts(args.dryRun);
    } else {
      process.stdout.write(
        "Next: node scripts/graph/generate-content-graph.mjs && node scripts/graph/generate-content-map.mjs\n",
      );
      process.stdout.write("Then: cd frontend && npm run catalog:generate\n");
    }
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  buildMindmapText,
  buildCourseMeta,
  normalizeOutlineTree,
  normalizeIndex,
  assertValidSlug,
};
