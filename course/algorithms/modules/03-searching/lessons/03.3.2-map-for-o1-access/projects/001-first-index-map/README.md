# First Index Map

## Problem context
Lookup tables turn repeated linear scans into constant-time gets. Building value → first index with a Map is a core search habit.

## Goal
Read an integer list, then one or more query lines; for each query print the first index or `-1`.

## Lesson concepts practiced
- [ ] Map preserves key identity without string coercion
- [ ] get/has/set are amortized O(1) for searches
- [ ] Build once, answer many membership lookups

## Functional requirements
- [ ] Line 1: space-separated integers (the array)
- [ ] Following lines: one integer query per line until EOF
- [ ] For each query print first index or `-1` on its own line

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `4 9 2 9` then queries `9`,`2`,`8` → `1` / `2` / `-1`
- [ ] `7 1 2` / `7` → `0`
- [ ] `5 5 5` / `5` → `0`
- [ ] `1 2` / `9` / `8` → `-1` / `-1`

## Example data

Input:
- `4 9 2 9`
- `9`
- `2`
- `8`

Output:
- `1`
- `2`
- `-1`

## Suggested plan (no solution)
1. Scan the array into a Map of first indices.
2. For each remaining line, `get` or print `-1`.
3. Preserve input order of query answers.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also support a `LAST` mode printing last indices.
