# BFS Levels

## Problem context

A social network feature shows "people within N connections of you" — this is exactly what BFS computes: visiting every account reachable from a starting account, level by level, using a queue.

## Goal

Read an adjacency list and a start index from stdin, and print the BFS visit order starting from that index using a queue (FIFO).

## Lesson concepts practiced
- [ ] BFS uses a queue (FIFO): nodes are dequeued in the same order they were enqueued.
- [ ] BFS visits nodes level by level — all direct neighbors of the start before any of their neighbors.
- [ ] A node is marked visited when it is enqueued to avoid revisiting it and looping forever on a graph with cycles.

## Functional requirements
- [ ] Read line 1: a JSON array of arrays — the 0-indexed adjacency list (`adjacency[i]` lists the neighbors of node `i`)
- [ ] Read line 2: the integer start index
- [ ] Run BFS from the start index using a queue
- [ ] Print the visit order as space-separated node indices on one line
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `bfsOrder(adjacencyList, start)` helper is enough
- [ ] Error handling: malformed input may throw (no special requirement)
- [ ] Correctness: a node already visited must never be enqueued or visited again

## Constraints
- [ ] Node.js only — no external libraries
- [ ] The adjacency list may describe a graph with cycles — the algorithm must still terminate
- [ ] Node indices are 0-based integers matching the array positions
- [ ] Use `JSON.parse` to read the adjacency list line — do not write a custom parser

## Acceptance criteria
- [ ] Kind `linear chain graph` (each node points to the next) → BFS order matches the chain order
- [ ] Kind `branching graph` (one node with two children that reconverge) → BFS order visits both branches before the shared descendant
- [ ] Kind `graph with a cycle` → BFS still terminates and visits every reachable node exactly once
- [ ] Kind `single isolated node` → BFS order is just that node

## Example data

Input:
```text
[[1, 2], [3], [3], []]
0
```

Output:
```text
0 1 2 3
```

Input:
```text
[[1], [2], [0]]
0
```

Output:
```text
0 1 2
```

## Suggested plan (no solution)
1. Read line 1 with `JSON.parse` into `adjacencyList`, and line 2 into `start` (a number).
2. Implement `bfsOrder(adjacencyList, start)`: initialize a `visited` set with `start`, a queue `[start]`, and an `order` array.
3. While the queue is non-empty: dequeue a node (`shift`), push it to `order`, then enqueue each unvisited neighbor (marking it visited immediately).
4. Print `order` joined by single spaces.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the BFS distance (number of edges from start) next to each node
- [ ] Add a DFS variant using a stack and compare the two orders for the same graph
