# Fixed Window Max Sum

## Problem context
Metrics and streaming drills often ask for the best contiguous segment of fixed length `k` — replaying sums from scratch is slow.

## Goal
Read `k` and an integer list; print the maximum sum of any contiguous window of length `k`, or `ERROR` if `n < k`.

## Lesson concepts practiced
- [ ] Fixed window of size k over an array
- [ ] Add entering element and drop leaving element
- [ ] Track the best window sum in one pass after the first window

## Functional requirements
- [ ] Line 1: positive integer `k`
- [ ] Line 2: space-separated integers
- [ ] Print max window sum, or `ERROR` when `n < k`

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `3` / `2 1 5 1 3 2` → `9`
- [ ] `4` / `1 2 3 4` → `10`
- [ ] `1` / `5 1 9` → `9`
- [ ] `5` / `1 2` → `ERROR`

## Example data

Input:
- `3`
- `2 1 5 1 3 2`

Output:
- `9`

## Suggested plan (no solution)
1. Parse `k` and the array; if `n < k` print `ERROR`.
2. Sum the first window; slide by adding the new right and removing the leaving left.
3. Keep the maximum sum seen.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print the start index of the winning window.
