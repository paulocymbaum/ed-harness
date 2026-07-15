# Safe Max Guard

## Problem context
Naive `max` that seeds from `arr[0]` fails on empty input. Edge cases must be listed before coding.

## Goal
Read one line of space-separated integers. Print the maximum, or `ERROR: empty` if there are no numbers.

## Lesson concepts practiced
- [ ] Failing empty input is the most common silent bug in interview code.
- [ ] Guard empty before assuming a first element (`maxSafe` pattern).
- [ ] Edge cases (empty, single, duplicates) change what invariants must survive.

## Functional requirements
- [ ] Parse whitespace-separated integers from one line
- [ ] Empty / whitespace-only → `ERROR: empty`
- [ ] Otherwise print the numeric maximum (single integer line)

## Non-functional requirements
- [ ] Handle negatives and duplicates
- [ ] No `Math.max(...arr)` explosion required — a loop is fine

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `3 1 4 1 5` → `5`
- [ ] `-2 -8 -1` → `-1`
- [ ] `7` → `7`
- [ ] empty line → `ERROR: empty`

## Example data

Input:
- `3 1 4 1 5`

Output:
- `5`

## Suggested plan (no solution)
1. Split and parse integers; if none, error.
2. Track a running max with a clear invariant.
3. Print the max.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also reject non-integer tokens with `ERROR: bad input`.
