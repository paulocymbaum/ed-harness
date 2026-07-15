# Projects — TDZ Access Reporter

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- `var` read before declaration → `undefined` (hoisted + auto-initialized)
- `let`/`const` read before declaration → `ReferenceError` (Temporal Dead Zone)
- Any binding read after its declaration line behaves normally
- The TDZ ends at the declaration line, not the end of the block

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-tdz-access-reporter/

Classify a (binding kind, timing) pair into `undefined`, `ReferenceError`, or `ok` using the hoisting/TDZ rules.

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
