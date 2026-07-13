# DFS

> Graph index: `03.4.1`

## Context

Depth-first search explores as far as possible along each branch before backtracking. It is the backbone of cycle detection, topological ideas, connected components, and path existence on graphs and trees.

## Predict first

Nodes `0-1-2` with edges `0→1`, `0→2`, `1→2`. Neighbors listed in ascending order. DFS from `0` visit order?

```js
// 0, then first neighbor 1, then 1's neighbor 2, then back — 2 already visited
// → 0 1 2
```

## Explanation

Recursive sketch:

```js
function dfs(u, adj, seen, order) {
  seen.add(u);
  order.push(u);
  for (const v of adj.get(u) ?? []) {
    if (!seen.has(v)) dfs(v, adj, seen, order);
  }
}
```

Iterative DFS uses an explicit stack. Marking `seen` **before** pushing neighbors (or on pop — be consistent) prevents infinite loops on cycles.

DFS does not guarantee shortest paths — that is BFS territory.

## What to observe

- Neighbor order changes the visit sequence.
- Tree edges vs back edges matter for cycle detection.
- Recursion depth can hit stack limits on long chains — iterative stack helps.

## Quick challenge

Modify DFS to detect a cycle in a directed graph using colors (white/gray/black). When do you report a cycle?
