# Backtracking Search

> Graph index: `03.4.4`

## Context

Backtracking searches a **decision tree**: choose, explore, undo. It powers combinations, permutations, N-queens, and constraint mazes — classic "search" beyond scanning a list.

## Predict first

Count combinations of size `k = 2` from `1..3`:

```js
// [1,2], [1,3], [2,3] → 3
```

## Explanation

Skeleton:

```js
function backtrack(start, path, n, k, acc) {
  if (path.length === k) {
    acc.push([...path]);
    return;
  }
  for (let i = start; i <= n; i++) {
    path.push(i);          // choose
    backtrack(i + 1, path, n, k, acc);
    path.pop();            // undo
  }
}
```

The undo step is mandatory — without it, branches corrupt shared state. Pruning (`if path.length + remaining < k) return`) cuts hopeless subtrees.

Backtracking is exponential in the worst case; bounds and ordering matter.

## What to observe

- Copy path when recording a solution (`[...path]`) if you mutate later.
- Order of trying choices affects time, not the final set (for exhaustive search).
- DFS-shaped call stack + undo = backtracking.

## Quick challenge

Adapt the template to permutations of `1..n` (no `start` cursor — use a `used` Set). Where does undo happen?
