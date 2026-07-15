# Min Feasible Capacity

## Problem context
Capacity planning asks for the smallest limit that still finishes within `D` days when packages must ship in order.

## Goal
Read `D` and weights; print the minimum shipping capacity that delivers all packages in at most `D` days (contiguous daily loads).

## Lesson concepts practiced
- [ ] Search the answer space, not only array indices
- [ ] Monotonic feasibility: if mid works, try smaller
- [ ] Predicate check decides which half to keep

## Functional requirements
- [ ] Line 1: positive integer `D` (days)
- [ ] Line 2: space-separated positive weights in order
- [ ] Print minimum feasible capacity

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `5` / `1 2 3 4 5 6 7 8 9 10` → `15`
- [ ] `1` / `1 2 3` → `6`
- [ ] `3` / `1 2 3` → `3`
- [ ] `2` / `5 5 5 5` → `10`

## Example data

Input:
- `5`
- `1 2 3 4 5 6 7 8 9 10`

Output:
- `15`

## Suggested plan (no solution)
1. Set `lo = max(weight)`, `hi = sum(weights)`.
2. Binary-search mid capacity; simulate days needed.
3. Shrink toward the minimum feasible mid.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print how many binary-search iterations ran.
