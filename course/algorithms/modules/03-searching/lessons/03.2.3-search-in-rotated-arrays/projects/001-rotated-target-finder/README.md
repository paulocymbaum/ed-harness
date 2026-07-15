# Rotated Target Finder

## Problem context
Rotation shows up in cyclic buffers and interview classics. You must still find a target without flattening or resorting the array.

## Goal
Read a rotated sorted array of **distinct** integers and a target; print its index or `-1`.

## Lesson concepts practiced
- [ ] One side of mid is always contiguous sorted
- [ ] Decide which half can contain the target
- [ ] Still O(log n) with careful half selection

## Functional requirements
- [ ] Line 1: space-separated distinct integers (rotated sorted ascending origin)
- [ ] Line 2: target
- [ ] Print index or `-1`

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `4 5 6 7 0 1 2` / `0` → `4`
- [ ] `4 5 6 7 0 1 2` / `5` → `1`
- [ ] `4 5 6 7 0 1 2` / `3` → `-1`
- [ ] `1 2 3 4` / `3` → `2`

## Example data

Input:
- `4 5 6 7 0 1 2`
- `0`

Output:
- `4`

## Suggested plan (no solution)
1. Binary search while identifying the sorted half.
2. Keep the half that can contain the target.
3. Return `-1` when the interval empties.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Handle a single duplicate value carefully (document the limitation).
