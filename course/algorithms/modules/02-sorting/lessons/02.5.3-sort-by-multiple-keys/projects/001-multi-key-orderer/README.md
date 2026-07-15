# Multi Key Orderer

## Problem context
Leaderboards need **math descending**, then **name ascending** on ties.

## Goal
Read two lines `math name`. Print `-1` if the first record should come before the second, `1` if after, `0` if equal on both keys.

## Lesson concepts practiced
- [ ] Primary: higher math first.
- [ ] Secondary: lexicographic name ascending.
- [ ] Full ties → `0`.

## Functional requirements
- [ ] Two lines: `<int> <name>`.
- [ ] Print `-1`, `0`, or `1`.

## Non-functional requirements
- [ ] Deterministic
- [ ] Names are single tokens (no spaces)

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `90 Ann` vs `90 Bob` → `-1`
- [ ] `80 Ann` vs `90 Bob` → `1`
- [ ] `90 Ann` vs `90 Ann` → `0`
- [ ] `95 Z` vs `90 A` → `-1`

## Example data

Input:
- `90 Ann`
- `90 Bob`

Output:
- `-1`

## Suggested plan (no solution)
1. Parse both records.
2. Compare math desc; if zero, compare names asc.
3. Print normalized sign.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a third key.
