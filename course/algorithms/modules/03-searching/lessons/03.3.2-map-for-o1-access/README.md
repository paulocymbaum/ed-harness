# Map for O1 Access

> Graph index: `03.3.2`

## Context

`Map` stores key/value pairs with true key identity (including numbers, objects, NaN as a key). For search problems — first index, complements, memo tables — `map.get` / `map.has` are the go-to amortized `O(1)` lookups.

## Predict first

```js
const m = new Map();
m.set(1, "num");
m.set("1", "str");
console.log(m.get(1), m.get("1"), m.size);
```

Unlike a plain object, do these collide?

## Explanation

Typical pattern for first-index search:

```js
const first = new Map();
for (let i = 0; i < arr.length; i++) {
  if (!first.has(arr[i])) first.set(arr[i], i);
}
```

Then queries become `first.get(q) ?? -1`. Pair-sum with hashing: store needed complements as you scan.

Prefer `Map` over objects when keys are not known-safe strings, when insertion order matters, or when you need `.size` without bookkeeping.

## What to observe

- `m.get(missing)` → `undefined` — decide whether to use `-1` or a sentinel.
- Building the Map is `O(n)`; each query is amortized `O(1)`.
- Do not confuse `Map` with `WeakMap` (GC semantics) for these drills.

## Quick challenge

Use one Map pass to solve two-sum returning indices for a target (assume one solution). What do you store as you walk?
