# Shell Gap Classifier

## Problem context
Shell sort is defined by its **gap sequence**. The classic teaching sequence halves `n` until `1`.

## Goal
Read `n`. Print the classic gaps `floor(n/2), floor(gap/2), …, 1` as space-separated integers. If `n < 2`, print `1` only when `n ≥ 1` else print `NONE`.

## Lesson concepts practiced
- [ ] First classic gap is `floor(n/2)`.
- [ ] Gaps shrink by half until `1`.
- [ ] Gap `1` must appear to finish sorting.

## Functional requirements
- [ ] One integer `n` on stdin (`n ≥ 0`).
- [ ] `n = 0` → `NONE`.
- [ ] `n = 1` → `1`.
- [ ] `n ≥ 2` → full classic sequence ending in `1`.

## Non-functional requirements
- [ ] Deterministic
- [ ] No sorting of an array required

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `8` → `4 2 1`
- [ ] `7` → `3 1`
- [ ] `1` → `1`
- [ ] `0` → `NONE`

## Example data

Input:
- `8`

Output:
- `4 2 1`

## Suggested plan (no solution)
1. Handle `n < 1` and `n === 1`.
2. Loop `gap = floor(n/2); gap > 0; gap = floor(gap/2)` collecting gaps.
3. Join with spaces.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support a Hibbard sequence variant.
