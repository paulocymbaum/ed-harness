<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.2.2-quick-sort:README.md -->

# Quick Sort

> Graph index: `02.2.2`

## Context

Quick sort partitions around a **pivot**: smaller values move left, larger right, then recurse. Average `O(n log n)`; worst `O(n²)` with bad pivots on sorted data. Good pivot strategy keeps it fast and often nearly in-place.

## Predict first

Array `[3, 1, 4, 2]` with last-element pivot `2` (Lomuto). After partitioning, at which index does `2` sit?

## Explanation

```js
function partition(a, lo, hi) {
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}
```

Balanced splits → `O(n log n)`. Extreme pivots on sorted input → `O(n²)`. Stack `O(log n)` expected. Classic in-place quicksort is **not** stable.

## What to observe

- Partition correctness before clever recursion.
- Pivot choice controls balance and worst case.
- Equals need three-way partition if stability/duplicates matter.

## Quick challenge

Why can sorted input with last-element pivot become quadratic?
