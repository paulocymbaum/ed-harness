# Shared Membership Checker

## Problem context
Nested `includes` scans are `O(n·m)`. Return whether two arrays share any value using a `Set` in `O(n + m)`.

## Goal
Read two lines of space-separated tokens. Print `true` if they share any value, else `false`.

## Lesson concepts practiced
- [ ] Average `O(1)` for `Set`/`Map` membership is the interview model.
- [ ] Converting an array to a `Set` turns nested `includes` into `O(n + m)`.
- [ ] Prefer `Map`/`Set` tooling over object-key coercion traps for algorithm lookups.

## Functional requirements
- [ ] Line 1: values of A (whitespace tokens; empty line → empty list)
- [ ] Line 2: values of B
- [ ] Compare as strings (token text)
- [ ] Print `true` or `false`

## Non-functional requirements
- [ ] Target `O(n + m)` with a `Set` (do not nest `includes` for credit)
- [ ] Deterministic output

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `a b c` / `x c y` → `true`
- [ ] `1 2` / `3 4` → `false`
- [ ] empty / `a` → `false`
- [ ] `foo` / `foo` → `true`

## Example data

Input:
- `a b c`
- `x c y`

Output:
- `true`

## Suggested plan (no solution)
1. Parse both lines into token arrays.
2. Put A into a `Set`, scan B for `has`.
3. Print `true`/`false`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the first shared token instead of a boolean.
