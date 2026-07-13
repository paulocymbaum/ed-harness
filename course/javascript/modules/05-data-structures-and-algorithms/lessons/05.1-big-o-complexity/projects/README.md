# Projects — Big-O Complexity

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- A single loop over the input is `O(n)`
- A loop nested inside another loop is `O(n^2)`
- Halving the search range every step (binary search) is `O(log n)`
- No loop, fixed number of operations is `O(1)`

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-big-o-classifier/

Map a loop-pattern label (`single-loop`, `nested-loop`, `binary-search`, `constant`) to its Big-O complexity class.

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
