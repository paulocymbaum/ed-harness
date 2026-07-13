# Object Key Sorter

## Problem context
APIs return objects. You need to sort rows by `name` or `score` with a clear comparator.

## Goal
Read `key` (`name` or `score`), count `n`, then `n` lines `name:score`. Print names in sorted order (space-separated): `name` ascending lexicographically, or `score` ascending numeric with name ascending on ties.

## Lesson concepts practiced
- [ ] Comparators read object properties.
- [ ] Tie-break with a secondary key when scores match.
- [ ] Output order is of names after sorting.

## Functional requirements
- [ ] Line 1: `name` or `score`. Line 2: `n`. Next `n` lines: `id:int`.
- [ ] Print sorted names space-separated.
- [ ] Unknown key → `ERROR: unknown key`.

## Non-functional requirements
- [ ] Deterministic
- [ ] Stable tie-break: name ascending when scores equal

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `score` / 3 rows bob:5 alice:5 carol:1 → `carol alice bob`
- [ ] `name` / same rows → `alice bob carol`
- [ ] `age` → `ERROR: unknown key`
- [ ] `score` / one row → that name

## Example data

Input:
- `score`
- `3`
- `bob:5`
- `alice:5`
- `carol:1`

Output:
- `carol alice bob`

## Suggested plan (no solution)
1. Parse key and rows into objects.
2. Sort with the appropriate comparator.
3. Print names.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support descending score with `score-desc`.
