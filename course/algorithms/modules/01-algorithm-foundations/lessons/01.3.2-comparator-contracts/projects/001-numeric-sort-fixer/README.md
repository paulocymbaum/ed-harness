# Numeric Sort Fixer

## Problem context
Default `Array.prototype.sort` without a comparator converts numbers to strings (`10` before `2`).

## Goal
Read one line of space-separated integers and print them sorted **numerically ascending**, space-separated.

## Lesson concepts practiced
- [ ] Default `sort()` without a comparator is almost never what you want for numbers.
- [ ] Comparator must return `< 0`, `0`, or `> 0` — not booleans.
- [ ] ` (a, b) => a - b ` sorts numbers ascending.

## Functional requirements
- [ ] Parse whitespace-separated integers
- [ ] Sort ascending with a numeric comparator
- [ ] Print joined by single spaces (no trailing space required beyond newline from runner)

## Non-functional requirements
- [ ] Do not rely on default string sort
- [ ] Empty line → print empty output (just newline / empty string)

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `1 10 2` → `1 2 10`
- [ ] `5 4 3` → `3 4 5`
- [ ] `-1 0 -2` → `-2 -1 0`
- [ ] `2 2 1` → `1 2 2`

## Example data

Input:
- `1 10 2`

Output:
- `1 2 10`

## Suggested plan (no solution)
1. Parse ints from the line.
2. Sort with `a - b`.
3. Join with spaces and print.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Multi-key: sort by absolute value then sign.
