# Combination Counter

## Problem context
Interview backtracking often starts with combinations: explore choose/skip decisions and count complete paths of length `k`.

## Goal
Read `n` and `k`; print how many combinations of size `k` exist from `1..n` (order irrelevant).

## Lesson concepts practiced
- [ ] Try a choice, recurse, then undo (backtrack)
- [ ] Prune when a partial solution cannot succeed
- [ ] Search the decision tree, not only a static array

## Functional requirements
- [ ] Line 1: `n k` non-negative integers (`k <= n`)
- [ ] Print `C(n,k)` as an integer

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `3 2` → `3`
- [ ] `5 3` → `10`
- [ ] `4 0` → `1`
- [ ] `4 1` → `4`

## Example data

Input:
- `3 2`

Output:
- `3`

## Suggested plan (no solution)
1. Backtrack with a start index and a path length counter.
2. When length hits `k`, increment the answer.
3. Pop after each recursive exploration.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the combinations themselves one per line.
