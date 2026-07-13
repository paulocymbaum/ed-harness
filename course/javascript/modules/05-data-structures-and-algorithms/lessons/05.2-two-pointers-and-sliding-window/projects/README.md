# Projects — Two Pointers and Sliding Window

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- `left` and `right` pointers start at opposite ends and only move toward each other
- On a sorted array, comparing the sum to the target tells you which pointer to move
- Two pointers together make at most `n` moves total, giving `O(n)` instead of `O(n^2)`

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-two-sum-sorted/

Find the two indices in a sorted array whose values sum to a target, using the two-pointer technique.

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
