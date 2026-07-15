# Frequency Counter

## Problem context
Counting tokens is the gateway to anagrams and majority votes. Build a frequency map once, then answer count queries.

## Goal
Read tokens on line 1; for each later query print how many times it appeared (`0` if never).

## Lesson concepts practiced
- [ ] Count occurrences with Map or object tallies
- [ ] Increment on each sighting in one pass
- [ ] Answer count queries from the finished table

## Functional requirements
- [ ] Line 1: space-separated tokens (strings)
- [ ] Following lines: query tokens until EOF
- [ ] Print an integer count per query

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `a b a a` / `a`/`b`/`c` → `3`/`1`/`0`
- [ ] `1 1 2` / `1`/`2`/`3` → `2`/`1`/`0`
- [ ] `z` / `z` → `1`
- [ ] `x y` / `z` → `0`

## Example data

Input:
- `a b a a`
- `a`
- `b`
- `c`

Output:
- `3`
- `1`
- `0`

## Suggested plan (no solution)
1. Tally line 1 into a Map.
2. For each query, print `map.get(q) ?? 0`.
3. Do not recount the array per query.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the mode (most frequent token) after the queries.
