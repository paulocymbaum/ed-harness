<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.2.1-arrays-and-typed-arrays:README.md -->

# Arrays and Typed Arrays

> Graph index: `01.2.1`

## Context

Most algorithm work in JavaScript starts with `Array`: contiguous logical indexes, `O(1)` random access by index, and rich methods. `TypedArray` (`Uint8Array`, `Float64Array`, …) is for dense numeric buffers when you care about fixed element size and binary data.

## Predict first

Which access pattern is cheaper for large `n`?

```js
// A: walk by index
for (let i = 0; i < arr.length; i++) use(arr[i]);

// B: repeatedly shift from the front
while (arr.length) use(arr.shift());
```

## Explanation

**Arrays**

- Read/write `arr[i]` → expected `O(1)`
- `push` / `pop` at the end → amortized `O(1)`
- `shift` / `unshift` at the front → `O(n)` (reindexes)
- `includes` / `indexOf` → `O(n)` scan

**Typed arrays**

```js
const bytes = new Uint8Array(4);
bytes[0] = 255;
bytes[1] = 10;
// Fixed length; no push/pop. Good for binary protocols, images, WASM buffers.
```

Use `TypedArray` when:

- Element type is a fixed numeric width
- You want a view over an `ArrayBuffer`
- You pass data to Web APIs / Node buffers

Prefer plain `Array` for mixed values, objects, and everyday algorithm practice.

## What to observe

- Sparse arrays (`arr[9999] = 1` with holes) behave differently; prefer dense arrays for algorithmic clarity.
- Spreading a typed array into a normal array copies — `O(n)` time and space.
- Don’t micro-optimize with typed arrays until the bottleneck is numeric bulk data.

## Quick challenge

Implement a queue using only `push` and `shift` on an array. What is the amortized cost of `dequeue`? Sketch a better structure using two stacks or a head index.
