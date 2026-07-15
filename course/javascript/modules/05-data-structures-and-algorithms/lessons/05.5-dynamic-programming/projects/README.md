# Projects — Dynamic Programming

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- `ways(n)` depends only on `ways(n-1)` and `ways(n-2)` — optimal substructure
- The naive recursive version recomputes the same subproblems many times — overlapping subproblems
- A bottom-up DP table computes each subproblem once, running in `O(n)` instead of `O(2^n)`

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-climbing-stairs-dp/

Count the number of ways to climb `n` stairs taking 1 or 2 steps at a time, using a bottom-up DP table.

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
