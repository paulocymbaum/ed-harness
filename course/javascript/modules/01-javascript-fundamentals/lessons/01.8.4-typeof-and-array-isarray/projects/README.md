# Projects — Type Tag Classifier

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- `typeof null === "object"` — detect null with `=== null`
- Arrays need `Array.isArray`, not `typeof`
- Array-like objects (`{ length: 2 }`) are not arrays
- Safe order: null → Array.isArray → typeof

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 024-type-tag-classifier/

Classify one JSON value into `null`, `array`, or a `typeof` tag using the lesson’s safe-check order.

## PBL contract checklist

Each project README must include (English headers):

- Problem context
- Goal
- Lesson concepts practiced
- Functional requirements
- Non-functional requirements
- Constraints
- Acceptance criteria
- Example data (if applicable)
- Suggested plan (no solution)
- Deliverables
- Extensions (optional)
