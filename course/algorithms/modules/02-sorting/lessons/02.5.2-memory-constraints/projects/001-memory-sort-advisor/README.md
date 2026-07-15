# Memory Sort Advisor

## Problem context
Environments with hard RAM limits force an explicit choice between buffer-hungry and in-place `n log n` sorts.

## Goal
Read a policy id and print `MERGE` or `HEAP`. Unknown → `ERROR: unknown policy`.

## Lesson concepts practiced
- [ ] Plenty of RAM + stability desire → merge.
- [ ] Tight RAM + guarantee → heap.
- [ ] Policy ids encode the constraint, not the array.

## Functional requirements
- [ ] `plenty-ram` → `MERGE`
- [ ] `need-stable` → `MERGE`
- [ ] `tight-ram` → `HEAP`
- [ ] `in-place-nlogn` → `HEAP`

## Non-functional requirements
- [ ] Exact labels
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `plenty-ram` → `MERGE`
- [ ] `need-stable` → `MERGE`
- [ ] `tight-ram` → `HEAP`
- [ ] `in-place-nlogn` → `HEAP`
- [ ] `gpu` → `ERROR: unknown policy`

## Example data

Input:
- `tight-ram`

Output:
- `HEAP`

## Suggested plan (no solution)
1. Map policies to MERGE/HEAP.
2. Print lookup or error.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `ok-worst-case-risk` → `QUICK`.
