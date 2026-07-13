# Divide Levels Reporter

## Problem context
Divide-and-conquer often halves the input. Students should see the `O(log n)` depth of balanced splits (and why `slice` copies hurt).

## Goal
Read a power-of-two `n` (`n >= 2`). Print how many times you must halve until the size is 1: `levels=<k>`.

## Lesson concepts practiced
- [ ] Divide → conquer recursively → combine.
- [ ] Halving gives `O(log n)` levels; with `O(n)` work per level, total is often `O(n log n)`.
- [ ] Prefer index ranges over `slice` to avoid extra copying.

## Functional requirements
- [ ] For `n = 2^k`, output `levels=k` (e.g. 8 → 3 because 8→4→2→1).
- [ ] If not a power of two `>= 2`, print `ERROR: need power of two`

## Non-functional requirements
- [ ] Integer math only
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `8` → `levels=3`
- [ ] `16` → `levels=4`
- [ ] `2` → `levels=1`
- [ ] `6` → `ERROR: need power of two`

## Example data

Input:
- `8`

Output:
- `levels=3`

## Suggested plan (no solution)
1. Validate power of two.
2. Count halvings while `n > 1`.
3. Print `levels=…`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print `note=avoid-slice` to remind about index ranges.
