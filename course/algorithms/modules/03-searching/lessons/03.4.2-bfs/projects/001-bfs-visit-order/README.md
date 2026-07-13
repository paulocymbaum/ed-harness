# BFS Visit Order

## Problem context
Level-order traversal and shortest unweighted paths start from the same queue loop. Practice producing the BFS visit sequence.

## Goal
Read a directed graph and start; print BFS visit order. Enqueue neighbors in edge-input order; mark on enqueue.

## Lesson concepts practiced
- [ ] Expand nodes level by level using a queue
- [ ] Mark visited when enqueued to avoid duplicates
- [ ] BFS order is a shortest-path foundation on unweighted graphs

## Functional requirements
- [ ] Same input shape as the DFS project: `n m`, edges, start
- [ ] Print space-separated BFS visit order from start

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] Triangle → `0 1 2`
- [ ] Star from 0 → `0 1 2 3`
- [ ] Edges `0 2` then `0 1` → `0 2 1`
- [ ] Start 0 with only edge `1 2` → `0`

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
1. Build adjacency lists.
2. Queue the start; mark seen.
3. While queue non-empty, dequeue and enqueue unseen neighbors.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print distances beside each visited node.
