# Nearly Sorted Chooser

## Problem context
Choosing a sort for production data starts with how **disordered** the input looks.

## Goal
Read a disorder id and print recommended algorithm: `INSERTION` or `MERGE`. Unknown → `ERROR: unknown disorder`.

## Lesson concepts practiced
- [ ] Few inversions → insertion.
- [ ] Random / many inversions → merge (`n log n` guarantee).
- [ ] Already-sorted is the extreme of nearly sorted.

## Functional requirements
- [ ] `few-inversions` → `INSERTION`
- [ ] `already-sorted` → `INSERTION`
- [ ] `random` → `MERGE`
- [ ] `reversed` → `MERGE`

## Non-functional requirements
- [ ] Exact labels
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `few-inversions` → `INSERTION`
- [ ] `already-sorted` → `INSERTION`
- [ ] `random` → `MERGE`
- [ ] `reversed` → `MERGE`
- [ ] `skew` → `ERROR: unknown disorder`

## Example data

Input:
- `few-inversions`

Output:
- `INSERTION`

## Suggested plan (no solution)
1. Map ids to recommendations.
2. Print lookup or error.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept an inversion count threshold.
