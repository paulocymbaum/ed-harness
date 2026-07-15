# Count Range Sizer

## Problem context
Before allocating counts, counting sort needs the **range size** `k = max - min + 1`.

## Goal
Read `min max` (integers, `max ≥ min`). Print `k`. If the range is wider than `1000000`, print `TOO_LARGE` instead.

## Lesson concepts practiced
- [ ] `k = max - min + 1`.
- [ ] Huge `k` makes counting sort impractical.
- [ ] Range size is independent of `n`.

## Functional requirements
- [ ] One line: two integers `min max`.
- [ ] Print `k` or `TOO_LARGE` when `k > 1000000`.

## Non-functional requirements
- [ ] No array allocation required
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `1 3` → `3`
- [ ] `0 0` → `1`
- [ ] `-2 2` → `5`
- [ ] `0 1000001` → `TOO_LARGE`

## Example data

Input:
- `1 3`

Output:
- `3`

## Suggested plan (no solution)
1. Parse min and max.
2. Compute `max - min + 1`.
3. Gate on the size limit.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also read `n` and warn when `k > 10 * n`.
