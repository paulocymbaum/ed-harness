# Set for Membership

> Graph index: `03.3.3`

## Context

A `Set` stores unique values and answers **"is this present?"** without paying for unused map values. Searching for membership, visited nodes, or seen characters is the classic use.

## Predict first

```js
const s = new Set([1, 2, 2, 3]);
console.log(s.size, s.has(2), s.has(9));
```

## Explanation

```js
const seen = new Set(arr);
if (seen.has(query)) { /* hit */ }
```

Vs array `includes`: `includes` is `O(n)` per query; `Set.has` is amortized `O(1)` after `O(n)` build. Vs `Map`: prefer `Set` when there is no associated payload.

Common pitfalls: mutating while iterating; expecting insertion of duplicates to increase `.size`; using objects and assuming deep equality (Set uses SameValueZero).

## What to observe

- `add` returns the set (chainable) but duplicates are ignored.
- `NaN` is considered the same as `NaN` inside a Set (unlike `===` alone).
- Graph DFS/BFS mark `visited` with a Set of node ids.

## Quick challenge

Deduplicate an array while preserving first-seen order using a Set. Why does `[...new Set(arr)]` work for primitives?
