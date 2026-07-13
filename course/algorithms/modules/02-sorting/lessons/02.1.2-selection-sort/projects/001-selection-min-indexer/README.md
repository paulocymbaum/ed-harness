# Selection Min Indexer

## Problem context
Selection sort’s core step is locating the **minimum index** in the unsorted suffix before swapping it into place.

## Goal
Read `start`, `n`, and `n` integers. Print the index of the minimum among `a[start]..a[n-1]` (leftmost on ties).

## Lesson concepts practiced
- [ ] Pass `i` selects from `i..n-1`.
- [ ] Finding the min index is the heart of selection.
- [ ] Ties: keep the leftmost minimum.

## Functional requirements
- [ ] Line 1: `start`. Line 2: `n`. Line 3: `n` ints.
- [ ] Print one integer index.
- [ ] `0 ≤ start < n`.

## Non-functional requirements
- [ ] Only scan the suffix — do not fully sort
- [ ] Deterministic leftmost-min on ties

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `0` / `4` / `4 2 5 1` → `3`
- [ ] `1` / `4` / `1 4 2 5` → `2`
- [ ] `0` / `3` / `2 2 1` → `2`
- [ ] `2` / `3` / `9 8 7` → `2`

## Example data

Input:
- `0`
- `4`
- `4 2 5 1`

Output:
- `3`

## Suggested plan (no solution)
1. Parse start, n, array.
2. Scan from start to n-1 tracking min index.
3. Print that index.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print the min value.
