# DFS Visit Order

## Problem context
Graph interviews ask you to traverse explicitly. DFS visit order reveals how adjacency direction and neighbor order interact.

## Goal
Read a directed graph and start node; print DFS visit order (space-separated). Try neighbors in the order edges are given.

## Lesson concepts practiced
- [ ] Go deep along an adjacency list before backtracking
- [ ] Mark visited to avoid cycles
- [ ] Visit order depends on neighbor listing order

## Functional requirements
- [ ] Line 1: `n m` (nodes `0..n-1`, edge count)
- [ ] Next `m` lines: directed edges `u v`
- [ ] Last line: start node
- [ ] Print visit order as space-separated ids

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] Triangle from 0 → `0 1 2`
- [ ] Chain 0→1→2→3 → `0 1 2 3`
- [ ] Start at 1 with only outs from 0 → `1`
- [ ] Edges `0 2` then `0 1` → `0 2 1`

## Example data

Input:
- `3 3`
- `0 1`
- `0 2`
- `1 2`
- `0`

Output:
- `0 1 2`

## Suggested plan (no solution)
1. Build adjacency lists appending edges in input order.
2. DFS from start, skipping seen nodes.
3. Record the order nodes are first marked visited.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print nodes never reached from start.
