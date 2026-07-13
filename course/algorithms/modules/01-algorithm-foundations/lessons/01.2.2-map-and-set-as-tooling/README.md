<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.2.2-map-and-set-as-tooling:README.md -->

# Map and Set as Tooling

> Graph index: `01.2.2`

## Context

Many “clever” algorithm tricks are just: **pay O(1) for membership or lookup**. In JavaScript, `Map` and `Set` are the safe default tools. Plain objects work only when keys are strings/symbols and you accept coercion quirks.

## Predict first

What prints?

```js
const obj = {};
obj[1] = "a";
obj["1"] = "b";
console.log(obj[1]);

const map = new Map();
map.set(1, "a");
map.set("1", "b");
console.log(map.get(1), map.size);
```

## Explanation

| Structure | Best for | Lookup |
|-----------|----------|--------|
| `Object` | JSON-shaped string keys | ~O(1), keys coerced to string |
| `Map` | Arbitrary keys (objects, numbers) | `get` / `has` ~O(1) average |
| `Set` | Unique membership | `has` / `add` ~O(1) average |

```js
// Frequency map — classic O(n) preprocessing for O(1) queries
function frequencies(arr) {
  const freq = new Map();
  for (const x of arr) freq.set(x, (freq.get(x) ?? 0) + 1);
  return freq;
}

// Deduplicate while preserving first-seen order
function unique(arr) {
  return [...new Set(arr)];
}
```

Object-key trap:

```js
const seen = {};
seen[idObject] = true; // becomes seen["[object Object]"]
```

Use `Map` when keys are not strings, or when you need reliable `.size` and insertion order iteration without prototype pollution concerns.

## What to observe

- Average O(1) for `Map`/`Set` assumes a good hash table — still the model you use in interviews.
- Converting an array to a `Set` for repeated `includes` checks turns O(n·m) nested scans into O(n + m).
- `WeakMap` / `WeakSet` are for object-keyed caches that shouldn’t block GC — later caching module.

## Quick challenge

Given two arrays, return `true` if they share any value. Write an O(n + m) solution with a `Set`. What’s wrong with nested `includes`?
