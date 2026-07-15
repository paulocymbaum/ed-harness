# Aux Space Reporter

## Problem context
Reviews ask how much **extra** memory grows with `n`. Separate input space from auxiliary allocations (arrays, maps, recursion stack).

## Goal
Read a pattern id and print its auxiliary space class.

## Lesson concepts practiced
- [ ] `slice`, `map`, `filter`, and spread allocate — usually `O(n)` auxiliary.
- [ ] In-place mutation can be `O(1)` auxiliary but risks surprising shared callers.
- [ ] A chain of `n` recursive calls often costs `O(n)` stack space.

## Functional requirements
- [ ] Support: `max-scalars`, `map-double`, `in-place`, `recursive-sum`.
- [ ] Print `O(1)` or `O(n)` (auxiliary).
- [ ] Unknown → `ERROR: unknown pattern`.

## Non-functional requirements
- [ ] Classify from the lesson patterns only
- [ ] Do not allocate real huge arrays in the classifier

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `max-scalars` → `O(1)`
- [ ] `map-double` → `O(n)`
- [ ] `in-place` → `O(1)`
- [ ] `recursive-sum` → `O(n)`
- [ ] `unknown` → `ERROR: unknown pattern`

## Example data

Input:
- `map-double`

Output:
- `O(n)`

## Suggested plan (no solution)
1. Map each pattern id to auxiliary class from the lesson.
2. Read one stdin line and print the lookup result.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `slice-copy` → `O(n)`.
