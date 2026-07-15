# Lower Bound Index

## Problem context
Duplicate-heavy sorted data makes "find any index" the wrong API. Lower bound answers the first position where `arr[i] >= target` — including insert-when-missing.

## Goal
Read a sorted ascending list and a target; print the lower-bound index (`0..n`).

## Lesson concepts practiced
- [ ] Lower bound = first index with arr[i] >= target
- [ ] Keep searching left when mid is still too large
- [ ] Return n when all elements are < target

## Functional requirements
- [ ] Line 1: space-separated sorted integers
- [ ] Line 2: target
- [ ] Print lower-bound index (may equal `n`)

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `1 2 2 2 5` / `2` → `1`
- [ ] `1 2 2 2 5` / `3` → `4`
- [ ] `1 2 5` / `0` → `0`
- [ ] `1 2 5` / `9` → `3`

## Example data

Input:
- `1 2 2 2 5`
- `2`

Output:
- `1`

## Suggested plan (no solution)
1. Use exclusive `hi = n`.
2. While `lo < hi`, branch on `a[mid] < target`.
3. Return `lo` as the first feasible index.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print upper bound on a second output line.
