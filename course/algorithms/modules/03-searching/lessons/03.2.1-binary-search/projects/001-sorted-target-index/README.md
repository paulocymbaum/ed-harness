# Sorted Target Index

## Problem context
Once data is sorted, looking up a key with linear scan wastes comparisons. Binary search returns an index (or missing) in logarithmic steps.

## Goal
Read a sorted ascending integer list and a target; print any matching index, or `-1` if absent. Prefer classic mid equality.

## Lesson concepts practiced
- [ ] Halve a sorted search interval each step
- [ ] Compare mid to the target to drop a half
- [ ] Return -1 when the interval empties

## Functional requirements
- [ ] Line 1: space-separated integers (sorted ascending)
- [ ] Line 2: target
- [ ] Print an index where `arr[i] === target`, else `-1`

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `1 3 5 7 9` / `7` → `3`
- [ ] `1 3 5 7 9` / `6` → `-1`
- [ ] `2 4 6` / `2` → `0`
- [ ] `2 4 6` / `6` → `2`

## Example data

Input:
- `1 3 5 7 9`
- `7`

Output:
- `3`

## Suggested plan (no solution)
1. Initialize inclusive `lo`/`hi`.
2. While `lo <= hi`, compare `arr[mid]` to the target and shrink.
3. Return `-1` if the interval empties.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Count how many mid comparisons occurred before returning.
