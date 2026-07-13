# Path Reconstruction

> Graph index: `03.4.3`

## Context

Search finds *that* a goal is reachable; reconstruction answers *how*. While running BFS/DFS, record `parent[child] = node` on first discovery. Then walk from the goal backward to the start and reverse.

## Predict first

Parents after BFS from `0`: `parent[1]=0`, `parent[2]=1`, `parent[3]=2`. Path `0 → 3`?

```js
// backtrack 3→2→1→0, reverse → 0 1 2 3
```

## Explanation

```js
function reconstruct(parent, start, goal) {
  if (goal !== start && parent[goal] === undefined) return null;
  const path = [];
  let cur = goal;
  while (cur !== undefined) {
    path.push(cur);
    if (cur === start) break;
    cur = parent[cur];
  }
  path.reverse();
  return path[0] === start ? path : null;
}
```

Always set parent only on **first** visit (BFS) so the path matches the search tree you care about (shortest hops for BFS).

## What to observe

- Missing parent on the goal (and goal ≠ start) ⇒ unreachable.
- Forward edges alone are not enough — you need the parent link chosen during search.
- Printing edges without reversing yields the path backward.

## Quick challenge

Adapt reconstruction to also return the hop length. How does it relate to `path.length`?
