# Range Sum Query

## Problem context
Reporting tools ask many contiguous range totals. Rescanning each range wastes time when a prefix array answers instantly.

## Goal
Read an integer array and inclusive indices `L R`; print `sum(arr[L..R])` using prefix sums.

## Lesson concepts practiced
- [ ] Build prefix[i] = sum of arr[0..i-1]
- [ ] Range sum arr[L..R] = prefix[R+1] - prefix[L]
- [ ] Answer many range queries after one O(n) prep

## Functional requirements
- [ ] Line 1: space-separated integers
- [ ] Line 2: `L R` inclusive 0-based indices (assume valid)
- [ ] Print the range sum as an integer

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `2 4 1 3` / `1 3` → `8`
- [ ] `2 4 1 3` / `0 3` → `10`
- [ ] `2 4 1 3` / `2 2` → `1`
- [ ] `5 5 5` / `0 1` → `10`

## Example data

Input:
- `2 4 1 3`
- `1 3`

Output:
- `8`

## Suggested plan (no solution)
1. Build `prefix` with `prefix[0]=0`.
2. Read `L` and `R`.
3. Print `prefix[R+1] - prefix[L]`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple queries after the array line.
