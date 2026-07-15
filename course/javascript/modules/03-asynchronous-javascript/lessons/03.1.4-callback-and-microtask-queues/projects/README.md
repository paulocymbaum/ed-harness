# Projects — Callback and Microtask Queues

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js
```

## What you should practice

- Microtasks drain before the next task
- Promise `.then` vs `setTimeout(0)` ordering
- Observing real runtime order (not pasting answer strings)

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-microtask-before-timer/

Schedule sync + Promise + `setTimeout(0)`, then print the observed order and confirm the microtask ran before the timer.

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
