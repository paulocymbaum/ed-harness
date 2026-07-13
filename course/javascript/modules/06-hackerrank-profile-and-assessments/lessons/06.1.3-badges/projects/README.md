# Projects — Badge Progress Reporter

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- A badge tier tracks cumulative solved-challenge count, not a single timed attempt
- `complete` only happens when `earned` equals `total` exactly — 19/20 is still `in-progress`
- The fraction is always reported as `earned/total`, in that order

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-badge-progress-reporter/

Turn `earned` and `total` solved counts for a badge tier into a `complete`/`in-progress` status plus the `earned/total` fraction.

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
