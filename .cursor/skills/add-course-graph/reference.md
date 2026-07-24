# Outline JSON for `add-course.js`

Pass via `--outline <file.json>`. Indexes are optional; when omitted the tool numbers by array order (`01`, `01.1`, `01.1.1`).

## Schema

```json
{
  "slug": "typescript",
  "title": "TypeScript",
  "modules": [
    {
      "index": "01",
      "title": "TypeScript Fundamentals",
      "sections": [
        {
          "index": "01.1",
          "title": "Getting Started",
          "lessons": [
            { "index": "01.1.1", "title": "Installing the Compiler" },
            { "index": "01.1.2", "title": "tsconfig Basics" }
          ]
        },
        {
          "index": "01.2",
          "title": "Basic Types",
          "lessons": [
            { "index": "01.2.1", "title": "Primitives and Annotations" }
          ]
        }
      ]
    }
  ]
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | no | If present, must match `--slug` |
| `title` | no | Falls back to `--title`; becomes mindmap root label |
| `modules[].title` | yes | Human label (index prefix added in mindmap) |
| `modules[].index` | no | One segment (`01`); first segment always zero-padded |
| `modules[].sections[].title` | yes | |
| `modules[].sections[].index` | no | Two segments (`01.1`) under parent module |
| `modules[].sections[].lessons[].title` | yes | |
| `modules[].sections[].lessons[].index` | no | Three segments (`01.1.1`) under parent section |

Aliases: `label` is accepted instead of `title` on module/section/lesson objects.

## Constraints

- Hierarchy depth is fixed at three levels under the root (module → section → lesson).
- Section indexes must nest under their module; lesson indexes under their section.
- Do not put mock-test modules in the outline — mocks are disk-only (`*-mock`) and are not graph leaves.

## Minimal outline (modules without lessons)

Valid for registering structure you will flesh out later:

```json
{
  "modules": [
    {
      "title": "Foundations",
      "sections": [{ "title": "Intro", "lessons": [] }]
    }
  ]
}
```

Empty `lessons` still creates module + section nodes in the mindmap. Add lesson lines before scaffolding with `scaffold-from-graph.mjs`.
