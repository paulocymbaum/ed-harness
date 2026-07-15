# BFS and DFS

> Graph index: `05.3`

## Context

Breadth-First Search (BFS) and Depth-First Search (DFS) are the two standard ways to visit every node in a graph or tree. BFS explores level by level using a **queue** (FIFO); DFS dives as deep as possible using a **stack** or recursion (LIFO). Choosing the right one matters: BFS finds the *shortest path* in an unweighted graph, DFS is simpler for exploring *all paths* or detecting structure.

## BFS with a queue

```js
function bfs(adjacencyList, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const node = queue.shift(); // dequeue: FIFO
    order.push(node);
    for (const neighbor of adjacencyList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // enqueue
      }
    }
  }
  return order;
}
```

## DFS with a stack (or recursion)

```js
function dfs(adjacencyList, start) {
  const visited = new Set([start]);
  const stack = [start];
  const order = [];
  while (stack.length > 0) {
    const node = stack.pop(); // pop: LIFO
    order.push(node);
    for (const neighbor of adjacencyList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  return order;
}
```

## Predict first

For the graph `0 -> [1, 2]`, `1 -> [3]`, `2 -> [3]`, `3 -> []`, starting at `0`: what order does BFS visit nodes in? What order does DFS (using the stack version above) visit them in? Are they the same?

## What to observe

- BFS visits nodes **level by level** — all direct neighbors of the start before any of their neighbors. This is why BFS finds the shortest path (fewest edges) in an unweighted graph.
- DFS visits nodes by going **as deep as possible first**, then backtracking — the stack-based version above gives a different order than recursive DFS because of how neighbors are pushed.
- Both algorithms mark nodes **visited** before/when enqueuing or pushing to avoid revisiting them and looping forever on a graph with cycles.
- The **only structural difference** between the two implementations above is the data structure: `queue.shift()` (FIFO) for BFS vs `stack.pop()` (LIFO) for DFS.
- Every node and edge is visited once, so both run in **O(V + E)** — vertices plus edges.

## Mini-exercise

Given adjacency list `[[1, 2], [3], [3], []]` (node `0` points to `1` and `2`; `1` and `2` both point to `3`; `3` has no outgoing edges), predict the BFS visit order starting from node `0`. Then predict the DFS (stack-based) visit order from the same start.
