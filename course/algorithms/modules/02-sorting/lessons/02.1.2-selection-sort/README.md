<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.1.2-selection-sort:README.md -->

# Selection Sort

> Graph index: `02.1.2`

## Context

Selection sort builds a sorted prefix by repeatedly finding the **minimum** in the unsorted suffix and swapping it into the next position. Many comparisons, few swaps — at most one swap per pass.

## Predict first

For `[4, 2, 5, 1]` with start index `0`, which index holds the minimum before the first swap?

## Explanation

```js
function selectionSort(a) {
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) [a[i], a[min]] = [a[min], a[i]];
  }
}
```

Comparisons are always `Θ(n²)`. Swaps are `O(n)`. Auxiliary space `O(1)`. Classic selection sort is **not stable**: a long-range swap can reorder equal keys.

## What to observe

- Pass `i` places the correct element at index `i`.
- Sorted input still pays quadratic comparisons.
- Few writes help when writes are expensive.

## Quick challenge

After the first selection pass on `[4, 2, 5, 1]`, what is the array?
