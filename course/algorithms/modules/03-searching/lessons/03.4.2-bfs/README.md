# BFS

> Graph index: `03.4.2`

## Context

Breadth-first search expands neighbors **layer by layer** using a queue. On unweighted graphs, the first time you reach a node is via a shortest hop path — making BFS the search for distances and level order.

## Predict first

Same graph as DFS demos: edges `0→1`, `0→2`, `1→2`, start `0`, neighbors in ascending order.

BFS visit order?

```js
// queue: 0 → expand 1 then 2 → 0 1 2
```

## Explanation

```js
function bfs(start, adj) {
  const seen = new Set([start]);
  const q = [start];
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      if (!seen.has(v)) {
        seen.add(v);
        q.push(v);
      }
    }
  }
  return order;
}
```

Mark on enqueue (not only on dequeue) so the same node is not queued twice. Prefer a real queue structure for large graphs (`shift` on arrays is `O(n)`).

## What to observe

- Distances: `dist[v] = dist[u] + 1` when first discovering `v` from `u`.
- BFS tree parents enable path reconstruction (next lesson).
- DFS vs BFS: deep stack vs wide queue — pick based on the question (path existence vs shortest hops).

## Quick challenge

Track `dist` during BFS from `0`. What is `dist[2]` on the triangle example?
