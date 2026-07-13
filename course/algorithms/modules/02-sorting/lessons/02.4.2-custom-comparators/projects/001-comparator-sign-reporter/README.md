# Comparator Sign Reporter

## Problem context
Interviews ask you to state the **sign** a comparator should return for a pair under a chosen order.

## Goal
Read `mode a b` where mode is `asc` or `desc` and `a`,`b` are integers. Print `-1`, `0`, or `1` for the numeric compare (normalized sign of `a-b` or `b-a`).

## Lesson concepts practiced
- [ ] Ascending: sign of `a - b`.
- [ ] Descending: sign of `b - a`.
- [ ] Equal values → `0`.

## Functional requirements
- [ ] One line: `asc|desc a b`.
- [ ] Print exactly `-1`, `0`, or `1`.

## Non-functional requirements
- [ ] Deterministic normalization (`Math.sign`)
- [ ] Unknown mode → `ERROR: unknown mode`

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `asc 3 5` → `-1`
- [ ] `asc 5 3` → `1`
- [ ] `asc 4 4` → `0`
- [ ] `desc 3 5` → `1`

## Example data

Input:
- `asc 3 5`

Output:
- `-1`

## Suggested plan (no solution)
1. Parse mode and numbers.
2. Compute `a-b` or `b-a`; take `Math.sign`.
3. Print the sign integer.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support `alpha` mode using localeCompare.
