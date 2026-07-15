# Sorted Run Merger

## Problem context
Merge sort’s combine step merges two **already sorted** runs. Correct ties keep stability.

## Goal
Read sizes `n m`, a sorted run of `n` ints, and a sorted run of `m` ints. Print the stably merged sequence (space-separated).

## Lesson concepts practiced
- [ ] Always take the smaller head of the two runs.
- [ ] On ties, take from the left run for stability.
- [ ] Append leftovers when one run empties.

## Functional requirements
- [ ] Line 1: `n m`. Line 2: `n` ints. Line 3: `m` ints (`n` or `m` may be 0; empty line if 0).
- [ ] Output one line of `n+m` space-separated ints.
- [ ] Stable merge on equals (`<=` from left).

## Non-functional requirements
- [ ] Linear merge — do not `sort` the concatenation
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `3 3` / `1 4 7` / `2 3 8` → `1 2 3 4 7 8`
- [ ] `2 2` / `1 1` / `1 2` → `1 1 1 2`
- [ ] `0 2` / empty / `3 4` → `3 4`
- [ ] `3 1` / `1 2 5` / `4` → `1 2 4 5`

## Example data

Input:
- `3 3`
- `1 4 7`
- `2 3 8`

Output:
- `1 2 3 4 7 8`

## Suggested plan (no solution)
1. Two indices into left/right.
2. Compare heads; push smaller (left on tie).
3. Concatenate remainders; join with spaces.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Count comparisons during the merge.
