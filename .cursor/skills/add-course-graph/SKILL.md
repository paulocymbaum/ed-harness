---
name: add-course-graph
description: >-
  Registers a new EdHarness course in graph/courses/<slug>.graph.txt with the exact
  mindmap + course.meta.json shape, via a deterministic CLI tool. Use when adding a
  course to the graph, creating a new course slug, scaffolding graph/courses/*.graph.txt,
  or inserting course.meta.json for a new curriculum.
disable-model-invocation: true
---

# Add Course to the Graph

## What this skill is for

Use this skill to **register a new course** so it appears in the graph system with the **exact** on-disk contracts:

| Artifact | Path | Role |
|----------|------|------|
| Mindmap (source of truth) | `graph/courses/<slug>.graph.txt` | Mermaid `mindmap` hierarchy |
| Rendered graph | `graph/courses/<slug>.graph.json` | nodes/edges for tools + scaffold |
| Course meta | `course/<slug>/course.meta.json` | `{ id, title, graphRootLabel, graphSlug }` |
| Course stub | `course/<slug>/README.md` + `modules/` | Discovers course via `listCourseSlugs` |

Do **not** hand-edit these files into shape. Run the tool.

## Tool (required)

```bash
node .cursor/tools/graph/add-course.js --slug <slug> --title "<Title>" [--outline <file.json>] [--dry-run] [--force] [--regenerate]
```

### Minimal (root only)

```bash
node .cursor/tools/graph/add-course.js --slug typescript --title "TypeScript" --dry-run
node .cursor/tools/graph/add-course.js --slug typescript --title "TypeScript" --regenerate
```

### With outline (modules → sections → lessons)

```bash
node .cursor/tools/graph/add-course.js \
  --slug typescript \
  --title "TypeScript" \
  --outline path/to/outline.json \
  --regenerate
```

Outline schema: [reference.md](reference.md).

## Workflow checklist

```
- [ ] Collect slug (kebab-case) + title from the user
- [ ] Optionally author outline.json (or start root-only and edit the mindmap later)
- [ ] Dry-run the tool; review planned files + courseMeta
- [ ] Run without --dry-run (add --regenerate to refresh content-graphs / content-map)
- [ ] cd frontend && npm run catalog:generate
- [ ] Add modules/lessons via create-course-module / scaffold-from-graph (after graph has leaves)
```

## Exact structures the tool writes

### `course.meta.json`

```json
{
  "id": "<slug>",
  "title": "<Title>",
  "graphRootLabel": "<Title>",
  "graphSlug": "<slug>"
}
```

### `*.graph.txt` (root only)

```text
mindmap
  root((Title))
```

### `*.graph.txt` (with outline)

```text
mindmap
  root((Title))
    01 Module Title
      01.1 Section Title
        01.1.1 Lesson Title
```

Indexes follow `normalizeIndexPath`: first segment zero-padded (`01`, `01.1`, `01.1.1`). Depth is fixed: module = 1 segment, section = 2, lesson = 3.

## Rules

1. Always pass `--slug` and `--title`. Slug must be kebab-case.
2. Prefer `--dry-run` first.
3. Never invent a different meta shape or mindmap dialect.
4. Use `--force` only when intentionally replacing an existing course registration.
5. After the graph has lesson leaves, scaffold disk content with `create-course-module` / `scaffold-from-graph.mjs --course <slug>`.
6. Topic search uses `find-topics-graph` with `--course <slug>`.

## After registration

```bash
node scripts/graph/generate-content-graph.mjs
node scripts/graph/generate-content-map.mjs
cd frontend && npm run catalog:generate
```

(`--regenerate` on the tool runs the first two.)

## Related skills

| Next step | Skill / tool |
|-----------|----------------|
| Find topics | `find-topics-graph` |
| Scaffold module + lessons | `create-course-module` |
| Full hierarchy contract | [`COURSE_STRUCTURE.md`](../../../COURSE_STRUCTURE.md) |
| Meta schemas | [`docs/meta-schemas.md`](../../../docs/meta-schemas.md) |
