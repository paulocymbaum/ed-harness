# Radix Digit Reader

## Problem context
Radix sort’s primitive is reading one **digit** at a place `p` so a stable pass can bucket by that digit.

## Goal
Read `x p` (non-negative `x`, place `p ≥ 0`). Print the base-10 digit of `x` at place `p` (`p=0` ones).

## Lesson concepts practiced
- [ ] `digit = floor(x / 10^p) % 10`.
- [ ] Place `0` is the least significant digit.
- [ ] Higher `p` peels more low digits away.

## Functional requirements
- [ ] One line: `x p`.
- [ ] Print a single digit `0..9`.

## Non-functional requirements
- [ ] Integer arithmetic only
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `723 0` → `3`
- [ ] `723 1` → `2`
- [ ] `723 2` → `7`
- [ ] `723 3` → `0`

## Example data

Input:
- `723 0`

Output:
- `3`

## Suggested plan (no solution)
1. Parse `x` and `p`.
2. Compute `Math.floor(x / 10**p) % 10`.
3. Print the digit.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a custom base as a third argument.
