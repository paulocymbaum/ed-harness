# Partition Labeler

## Problem context
Quick sort’s progress comes from one correct **partition**: smaller left of pivot, greater-or-equal right.

## Goal
Read `n` and `n` integers. Treat the last element as pivot. Run one Lomuto partition (`a[j] < pivot` moves left). Print `LEFT PIVOT RIGHT` where LEFT/RIGHT are post-partition values joined by `+`, or `-` if empty.

## Lesson concepts practiced
- [ ] Pivot is placed at its final index for this partition.
- [ ] Left is `a[0..p-1]`; right is `a[p+1..]` after partition.
- [ ] Pivot choice (here: last element) controls balance.

## Functional requirements
- [ ] Line 1: `n`. Line 2: `n` ints (`n ≥ 1`).
- [ ] Output three tokens: left, pivot, right.
- [ ] Empty side prints `-`; non-empty sides join values with `+`.

## Non-functional requirements
- [ ] One partition only — do not recurse
- [ ] Deterministic Lomuto order

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `4` / `3 1 4 2` → `1 2 4+3`
- [ ] `3` / `2 3 1` → `- 1 3+2`
- [ ] `3` / `1 2 3` → `1+2 3 -`
- [ ] `1` / `5` → `- 5 -`

## Example data

Input:
- `4`
- `3 1 4 2`

Output:
- `1 2 4+3`

## Suggested plan (no solution)
1. Implement Lomuto with last pivot; note pivot index `p`.
2. Format `a.slice(0,p)` and `a.slice(p+1)` with `+` or `-`.
3. Print `left pivot right`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print the pivot index.
