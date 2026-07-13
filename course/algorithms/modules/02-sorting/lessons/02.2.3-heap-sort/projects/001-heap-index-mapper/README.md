# Heap Index Mapper

## Problem context
Heap sort navigates a binary heap with **index formulas**. Getting parent/child wrong breaks heapify.

## Goal
Read a query `parent i` or `child i` (`i` is a 0-based index). Print either one parent index, or `left right` child indices. If parent of root is requested, print `NONE`.

## Lesson concepts practiced
- [ ] `parent(i) = floor((i-1)/2)` for `i > 0`.
- [ ] `left = 2*i+1`, `right = 2*i+2`.
- [ ] Root has no parent.

## Functional requirements
- [ ] Input: one line `parent <i>` or `child <i>`.
- [ ] `parent 0` → `NONE`.
- [ ] `child` always prints two integers.

## Non-functional requirements
- [ ] Pure arithmetic — no array required
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] `i ≥ 0`

## Acceptance criteria
- [ ] `child 1` → `3 4`
- [ ] `child 0` → `1 2`
- [ ] `parent 4` → `1`
- [ ] `parent 0` → `NONE`

## Example data

Input:
- `child 1`

Output:
- `3 4`

## Suggested plan (no solution)
1. Parse command and integer `i`.
2. Apply the heap index formulas.
3. Print `NONE` or the indices.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Reject negative indices with an error string.
