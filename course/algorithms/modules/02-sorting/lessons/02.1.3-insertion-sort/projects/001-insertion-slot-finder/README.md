# Insertion Slot Finder

## Problem context
Before shifting in insertion sort, you must know the **slot** where the new key belongs in the sorted prefix.

## Goal
Read prefix length `m`, `m` sorted ascending integers, and a `key`. Print the index where `key` should be inserted (stable: after any equal values).

## Lesson concepts practiced
- [ ] Insert index is where the key belongs in the prefix.
- [ ] Stable insertion places equals after existing equals.
- [ ] Shifts move larger elements right of that index.

## Functional requirements
- [ ] Line 1: `m`. Line 2: `m` ints (sorted). Line 3: `key`.
- [ ] Print insert index in `0..m`.
- [ ] On equals, insert after the last equal.

## Non-functional requirements
- [ ] Output only the index
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `3` / `1 3 5` / `2` → `1`
- [ ] `3` / `1 2 3` / `0` → `0`
- [ ] `3` / `1 2 3` / `4` → `3`
- [ ] `3` / `1 2 2` / `2` → `3`

## Example data

Input:
- `3`
- `1 3 5`
- `2`

Output:
- `1`

## Suggested plan (no solution)
1. Scan while prefix[i] <= key (stable upper bound).
2. Print the index.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Count how many shifts would occur.
