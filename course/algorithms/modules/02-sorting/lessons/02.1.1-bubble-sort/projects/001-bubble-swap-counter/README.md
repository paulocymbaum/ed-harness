# Bubble Swap Counter

## Problem context
Bubble sort learns from **adjacent swaps**. Counting swaps in one pass shows how inversions move toward the end.

## Goal
Read `n` and `n` integers. Perform one left-to-right bubble pass (swap when `a[i] > a[i+1]`) and print the swap count. Do not run further passes.

## Lesson concepts practiced
- [ ] Each swap fixes one adjacent inversion.
- [ ] One pass can move a large value toward the end.
- [ ] Zero swaps in a pass means sorted.

## Functional requirements
- [ ] Line 1: `n`. Line 2: `n` integers.
- [ ] Count swaps in exactly one ascending bubble pass.
- [ ] Print a single integer.

## Non-functional requirements
- [ ] Deterministic I/O
- [ ] In-place mutation for the pass is fine

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] `1 ≤ n ≤ 1000`

## Acceptance criteria
- [ ] `3` / `3 1 2` → `2`
- [ ] `3` / `1 2 3` → `0`
- [ ] `4` / `4 3 2 1` → `3`
- [ ] `2` / `2 1` → `1`

## Example data

Input:
- `3`
- `3 1 2`

Output:
- `2`

## Suggested plan (no solution)
1. Parse `n` and the array.
2. Walk `i` from `0` to `n-2`; swap and count when out of order.
3. Print the count.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print the array after the pass.
