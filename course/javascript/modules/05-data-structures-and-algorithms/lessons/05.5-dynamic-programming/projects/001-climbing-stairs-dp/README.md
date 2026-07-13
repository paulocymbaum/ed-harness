# Climbing Stairs DP

## Problem context

A fitness app wants to show users how many distinct ways they could climb a staircase of `n` steps if each stride covers either 1 or 2 steps. For small staircases a naive recursive count works fine, but for larger ones it must scale linearly, not exponentially.

## Goal

Read one non-negative integer `n` from stdin and print the number of distinct ways to climb `n` stairs taking 1 or 2 steps at a time, computed with a bottom-up DP table.

## Lesson concepts practiced
- [ ] `ways(n)` depends only on `ways(n-1)` and `ways(n-2)` — optimal substructure.
- [ ] The naive recursive version recomputes the same subproblems many times — overlapping subproblems.
- [ ] A DP table fills bottom-up from the smallest subproblem, computing each value once and reusing it, running in `O(n)` time.

## Functional requirements
- [ ] Read one line containing a single non-negative integer `n`
- [ ] Compute the number of ways to climb `n` stairs using 1-step and 2-step moves, via a bottom-up table (not naive unmemoized recursion)
- [ ] Handle the base cases `n = 0` (one way: take no steps) and `n = 1` (one way: a single 1-step)
- [ ] Print the result as a single integer
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `waysToClimb(n)` helper is enough
- [ ] Performance: `O(n)` time using a table (or two rolling variables) — do **not** use unmemoized recursion
- [ ] Error handling: negative input may throw (no special requirement)

## Constraints
- [ ] Node.js only — no external libraries
- [ ] `n` fits comfortably in a JavaScript `Number` for the tested range (`n <= 40`)
- [ ] Build the table bottom-up (iteratively) rather than top-down recursively, to demonstrate the DP technique from the lesson

## Acceptance criteria

The DP table must be filled bottom-up and each subproblem computed only once, matching these smaller-answer values:
- [ ] Kind `n = 0` → stdout `1`
- [ ] Kind `n = 1` → stdout `1`
- [ ] Kind `n = 2` → stdout `2`
- [ ] Kind `n = 5` → stdout `8`
- [ ] Kind `n = 10` → stdout `89`

## Example data

Input:
```text
5
```

Output:
```text
8
```

Input:
```text
2
```

Output:
```text
2
```

## Suggested plan (no solution)
1. Read the line and parse it into an integer `n`.
2. Implement `waysToClimb(n)`: handle `n = 0` and `n = 1` directly, then fill a table from index `2` to `n` using `table[i] = table[i-1] + table[i-2]`.
3. Print `table[n]` (or the equivalent base-case value) plus a newline.
4. Trace the table by hand for `n = 0..5` and compare against the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Generalize to steps of size 1, 2, or 3 and re-derive the recurrence
- [ ] Reduce space to `O(1)` by keeping only the last two values instead of a full table
