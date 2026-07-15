<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.1.2-space-complexity:README.md -->

# Space Complexity

> Graph index: `01.1.2`

## Context

Space complexity asks how much **extra memory** grows with input size. Time and space trade off: caching can save time but costs RAM; in-place algorithms save memory but may mutate input.

## Predict first

Do these use the same auxiliary space?

```js
function copy(arr) {
  return arr.slice(); // new array
}

function doubleInPlace(arr) {
  for (let i = 0; i < arr.length; i++) arr[i] *= 2;
  return arr;
}
```

## Explanation

Distinguish:

- **Input space** — memory that already holds the input (usually not counted as “extra”).
- **Auxiliary space** — extra structures you allocate (new arrays, maps, recursion stack).

```js
// O(1) auxiliary space — only a few scalars
function max(arr) {
  let m = -Infinity;
  for (const x of arr) if (x > m) m = x;
  return m;
}

// O(n) auxiliary — builds a new array of size n
function doubled(arr) {
  return arr.map((x) => x * 2);
}
```

Recursion uses the **call stack**. A chain of `n` recursive calls often costs `O(n)` space even with no explicit arrays:

```js
function sumRecursive(arr, i = 0) {
  if (i >= arr.length) return 0;
  return arr[i] + sumRecursive(arr, i + 1); // depth n
}
```

## What to observe

- `slice`, `map`, `filter`, and spread `[...arr]` allocate — usually `O(n)` auxiliary.
- In-place mutation can be `O(1)` auxiliary but risks surprising callers who shared the array.
- Tail-call optimization is **not** something you should rely on in JavaScript engines.

## Quick challenge

Rewrite `sumRecursive` iteratively. What is its auxiliary space compared to the recursive version?
