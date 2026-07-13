---
name: create-course-module
description: >-
  Scaffolds a course module and its graph leaf lessons under course/<course>/modules/.
  Uses scaffold-from-graph.mjs driven by graph/courses/<slug>.graph.txt. Use when creating
  a new module or populating all lessons for a graph section (01–07). Always pass --course.
disable-model-invocation: true
---

# Create Course Module

## Quick start

1. **Find the module in the graph**:

```bash
node .cursor/tools/graph/find-node-by-index.js --course javascript "01"
```

2. **Scaffold module + all leaf lessons** (dry-run first):

```bash
node scripts/graph/scaffold-from-graph.mjs --course javascript --module "01" --dry-run
node scripts/graph/scaffold-from-graph.mjs --course javascript --module "01"
```

3. **Fill module README** at `course/javascript/modules/01-javascript-fundamentals/README.md`

4. **Validate**:

```bash
node scripts/validate-module.mjs --module 01-javascript-fundamentals
node scripts/graph/generate-content-map.mjs
cd frontend && npm run catalog:generate
```

## Workflow checklist

```
- [ ] Graph index confirmed via find-topics-graph (--course)
- [ ] Dry-run scaffold reviewed
- [ ] Module + lessons created under the correct course folder
- [ ] course.meta.json has graphSlug
- [ ] Module README filled
- [ ] validate-module + catalog:generate
```

## Notes

- `--course` selects **both** the graph source (`graph/courses/<slug>.graph.txt`) and the destination folder.
- Do not scaffold one course's graph into another course folder.
- Full hierarchy contract: [`COURSE_STRUCTURE.md`](../../../COURSE_STRUCTURE.md)
