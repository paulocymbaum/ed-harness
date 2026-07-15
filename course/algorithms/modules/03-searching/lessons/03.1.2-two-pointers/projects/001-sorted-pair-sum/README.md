# Sorted Pair Sum

## Problem context
Interview prompts often ask whether two numbers in a **sorted** array add to a target. Nested loops work but waste comparisons two pointers can skip.

## Goal
Read a sorted ascending integer list and a target; print `YES` if two distinct indices sum to the target, else `NO`.

## Lesson concepts practiced
- [ ] Opposite-end pointers on a sorted array
- [ ] Move left or right based on sum vs target
- [ ] Each step shrinks the search interval

## Functional requirements
- [ ] Line 1: space-separated integers (sorted ascending)
- [ ] Line 2: target integer
- [ ] Print `YES` or `NO` (distinct indices; values may repeat)

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `1 2 4 7 11` / `9` → `YES`
- [ ] `1 2 3 4` / `10` → `NO`
- [ ] `1 5 8` / `9` → `YES`
- [ ] `2 2 2` / `4` → `YES`

## Example data

Input:
- `1 2 4 7 11`
- `9`

Output:
- `YES`

## Suggested plan (no solution)
1. Set `L=0`, `R=n-1`.
2. Compare sum to target; move `R` left if too big, `L` right if too small.
3. Stop with `YES` on match or `NO` when pointers cross.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the two indices instead of YES/NO.
