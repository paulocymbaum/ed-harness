<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.1.1-time-complexity-big-o:README.md -->

# Time Complexity Big-O

> Graph index: `01.1.1`

## Context

Big-O describes how runtime **grows** as input size `n` grows. In interviews and reviews you use it to compare approaches before micro-optimizing JavaScript.

## Predict first

Which grows faster as `n` increases?

```js
function linear(n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += i;
  return s;
}

function quadratic(n) {
  let s = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) s += i + j;
  }
  return s;
}
```

## Explanation

Common ranks (slowest growth → fastest growth of cost):

| Class | Typical JS shape |
|-------|------------------|
| `O(1)` | Index access, `Map.get` |
| `O(log n)` | Binary search on sorted data |
| `O(n)` | Single pass over an array |
| `O(n log n)` | Efficient comparison sorts |
| `O(n²)` | Nested loops over the same `n` |

Big-O ignores constants and lower-order terms: `3n + 10` is still `O(n)`. Focus on the **dominant** term.

```js
// O(n) — one loop tied to n
function sum(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// Still O(n): two sequential passes are 2n → O(n)
function sumTwice(arr) {
  return sum(arr) + sum(arr);
}
```

## What to observe

- Nested loops over `n` × `n` → `O(n²)`, even if the body is tiny.
- Halving `n` each step (binary search style) → `O(log n)`.
- Big-O is about **growth**, not absolute milliseconds on your laptop.

## Quick challenge

Classify the time complexity of a function that, for each index `i`, scans from `0` to `i`. Is it `O(n)` or `O(n²)`? Why?
