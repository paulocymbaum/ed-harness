# Projects — Coding Challenge

Practice exercises for this mock test section. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- Sliding a window across an array instead of recomputing each window's sum from scratch
- Validating a window size against the array length before attempting the slide
- Trading a nested-loop `O(n * k)` scan for an `O(n)` single pass
- Handling all-negative inputs and boundary window sizes (`k = 1`, `k = n`) correctly

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Exactly **one** project per mock test coding section (`001-<slug>`)

## Project catalog

### 001-sliding-window-max-sum/

Find the maximum sum of any contiguous window of length `k` in an array read from stdin, or print `ERROR` for an invalid `k`.

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
