<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.2.4-divide-and-conquer:README.md -->

# Divide and Conquer

> Graph index: `01.2.4`

## Context

Divide and conquer is a problem-solving pattern: **split** the input, **solve** pieces (often recursively), **combine** results. Merge Sort and binary search are the flagship examples you’ll meet in later modules.

## Predict first

What is the recurrence “shape” of this function on an array of length `n`?

```js
function solve(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = solve(arr.slice(0, mid));
  const right = solve(arr.slice(mid));
  return combine(left, right);
}
```

## Explanation

Three steps:

1. **Divide** — cut into smaller subproblems (often halves)
2. **Conquer** — solve subproblems recursively until a base case
3. **Combine** — merge partial answers into the full answer

```js
// Binary search is divide-and-conquer without a heavy combine
function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

If each level of the recursion tree does `O(n)` work and there are `O(log n)` levels (halving), total time is often `O(n log n)` — the Merge Sort story.

Cost of `arr.slice` in the sketch above allocates new arrays each call — clear teaching code, but production divide-and-conquer usually passes **index ranges** to avoid extra `O(n log n)` copying.

## What to observe

- Base case must shrink the problem; otherwise recursion never ends.
- Combine cost matters: cheap combine (binary search) vs merge of two sorted halves.
- Balanced splits beat lopsided ones for depth and total work.

## Quick challenge

Rewrite the sketch so `solve(arr, lo, hi)` uses indexes instead of `slice`. What space did you save?
