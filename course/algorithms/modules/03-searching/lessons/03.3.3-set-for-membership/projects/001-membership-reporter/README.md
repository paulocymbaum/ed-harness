# Membership Reporter

## Problem context
Presence checks appear in filtering, visited-node tracking, and "have we seen this id?" gates. A Set avoids linear `includes` loops.

## Goal
Build a Set from line 1; for each later query print `YES` if present else `NO`.

## Lesson concepts practiced
- [ ] Set answers has(x) in amortized O(1)
- [ ] Use Set when you only care about presence
- [ ] Duplicate inserts do not grow the set

## Functional requirements
- [ ] Line 1: space-separated integers
- [ ] Following lines: queries until EOF
- [ ] Print `YES` or `NO` per query

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `1 2 2 3` / `2`/`9`/`1` → `YES`/`NO`/`YES`
- [ ] `5` / `4` → `NO`
- [ ] `1 2` / `1`/`2` → `YES`/`YES`
- [ ] `-1 0 1` / `0`/`-2` → `YES`/`NO`

## Example data

Input:
- `1 2 2 3`
- `2`
- `9`
- `1`

Output:
- `YES`
- `NO`
- `YES`

## Suggested plan (no solution)
1. Parse line 1 into a Set.
2. For each remaining line, `has` → YES/NO.
3. Ignore that input duplicates do not increase size.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the final `.size` after answers.
