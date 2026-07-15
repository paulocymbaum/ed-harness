# Projects — Single-Threaded Execution

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

## What you should practice

- Synchronous code runs before scheduled callbacks
- `setTimeout` schedules work; it does not run immediately
- Walking an op graph to separate sync vs deferred work

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-sync-trace/

Implement `syncOrder(ops)` over snippet graphs; print only labels that run before any timeout callback.

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
