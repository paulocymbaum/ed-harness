# Parent Path Builder

## Problem context
After BFS/DFS you often keep only parent pointers. Reconstruction turns those links into a printable route — or reports unreachability.

## Goal
Read start, parent pairs, and goal; print the path or `UNREACHABLE`.

## Lesson concepts practiced
- [ ] Store parent[v] when first discovering v
- [ ] Walk parents from goal back to start
- [ ] Reverse the walk to print the forward path

## Functional requirements
- [ ] Line 1: start node
- [ ] Following lines until a single-token line: `child parent` pairs
- [ ] Final line: goal node
- [ ] Print space-separated path, or `UNREACHABLE`

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] Chain to 3 → `0 1 2 3`
- [ ] Branch to 2 → `0 2`
- [ ] Goal equals start → `5`
- [ ] Missing goal → `UNREACHABLE`

## Example data

Input:
- `0`
- `1 0`
- `2 1`
- `3 2`
- `3`

Output:
- `0 1 2 3`

## Suggested plan (no solution)
1. Load parents into a Map.
2. Walk from goal via parents until start or failure.
3. Reverse and print, or emit `UNREACHABLE`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Reject cyclic parent pointers with a clear error.
