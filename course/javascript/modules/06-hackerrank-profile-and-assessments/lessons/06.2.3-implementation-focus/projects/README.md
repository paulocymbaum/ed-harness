# Projects — Implementation Checklist Counter

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- Implementation problems reward completeness — a checklist tracks whether every spec rule is covered
- Only lines starting with the exact `[x]` or `[ ]` markers count; everything else is ignored
- "Done" tracks coverage, not correctness — a done item can still be wrong

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-implementation-checklist-counter/

Count `[x]` (done) versus `[ ]` (todo) checklist lines from stdin and print `done=<A> todo=<B>`.

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
