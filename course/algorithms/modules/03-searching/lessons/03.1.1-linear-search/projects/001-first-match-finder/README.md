# First Match Finder

## Problem context
You often need the **first** occurrence of a value in an unsorted list — tickets, logs, or ad-hoc arrays with no sort guarantee.

## Goal
Read a space-separated integer list and a target; print the first matching index, or `-1` if absent.

## Lesson concepts practiced
- [ ] Scan left to right until the target matches
- [ ] Worst case is O(n) when the target is missing or last
- [ ] Return the first index, not every match

## Functional requirements
- [ ] Line 1: space-separated integers
- [ ] Line 2: target integer
- [ ] Print the first index where `arr[i] === target`, else `-1`

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `4 9 2 9` / `9` → `1`
- [ ] `1 2 3` / `9` → `-1`
- [ ] `7 1 2` / `7` → `0`
- [ ] `1 2 8` / `8` → `2`

## Example data

Input:
- `4 9 2 9`
- `9`

Output:
- `1`

## Suggested plan (no solution)
1. Parse line 1 into an array of numbers and line 2 as the target.
2. Loop `i` from `0` to `n-1`; on first match return `i`.
3. If the loop ends, print `-1`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print how many comparisons were made before returning.
