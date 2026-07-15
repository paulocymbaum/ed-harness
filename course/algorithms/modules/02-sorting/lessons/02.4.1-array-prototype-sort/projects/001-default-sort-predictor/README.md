# Default Sort Predictor

## Problem context
JS developers are often surprised that `[10,2,1].sort()` is **not** numeric. This project predicts default order.

## Goal
Read one line of integers. Print them in the order `Array.prototype.sort` would produce **without** a comparator (space-separated). Do not rely on calling `.sort()` if your environment differs — implement the default string lexicographic rule.

## Lesson concepts practiced
- [ ] Default sort converts to strings.
- [ ] Lexicographic UTF-16 / string order on decimal forms.
- [ ] Numeric ascending needs an explicit comparator.

## Functional requirements
- [ ] One line of integers (possibly negative).
- [ ] Print default-sort order space-separated.
- [ ] Empty input → empty output line.

## Non-functional requirements
- [ ] Deterministic string compare on `String(n)`
- [ ] Node.js only

## Constraints
- [ ] No external libraries
- [ ] You may use `.sort()` only with an explicit string comparator matching the default rule

## Acceptance criteria
- [ ] `10 2 1` → `1 10 2`
- [ ] `9 80 7` → `7 80 9`
- [ ] `1 1 1` → `1 1 1`
- [ ] `-1 -2 0` → `-1 -2 0` (string order of `"-1"`,`"-2"`,`"0"`)

## Example data

Input:
- `10 2 1`

Output:
- `1 10 2`

## Suggested plan (no solution)
1. Parse ints; map to strings.
2. Sort strings lexicographically.
3. Join originals in that order (same string form).

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Contrast with numeric `(a,b)=>a-b` on the same input.
