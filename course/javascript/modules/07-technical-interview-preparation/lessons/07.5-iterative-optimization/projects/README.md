# Projects — Iterative Optimization

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- The brute-force stage is typically O(n^2) (e.g. nested loops checking every pair)
- The better stage often reaches O(n log n) (e.g. sorting first, then a linear scan)
- The optimal stage often reaches O(n) by trading space for time (e.g. a hash map)
- Naming the complexity out loud at each narration stage is what interviewers listen for

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-complexity-upgrade-labeler/

Read a narration stage (`brute`/`better`/`optimal`) from stdin and print its target complexity tag.

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
