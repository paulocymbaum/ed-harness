# Projects — Cycle Detection

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- Floyd's tortoise-and-hare uses two pointers at different speeds to detect a cycle in `O(1)` extra space
- A cycle exists whenever the chain revisits any earlier node, not necessarily the first one
- Both the hash-set walk and Floyd's algorithm run in `O(n)` time

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-cycle-detector/

Detect whether a `next`-pointer chain starting at index `0` loops back on itself or ends cleanly.

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
