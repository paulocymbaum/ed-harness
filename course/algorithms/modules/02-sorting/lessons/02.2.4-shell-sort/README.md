<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.2.4-shell-sort:README.md -->

# Shell Sort

> Graph index: `02.2.4`

## Context

Shell sort is insertion sort on elements **gap** apart, with the gap shrinking (e.g. `n/2, n/4, …, 1`). Early large gaps move values far quickly; the final gap-1 pass is ordinary insertion on a nearly sorted array.

## Predict first

For `n = 8` with the classic Hibbard-free sequence `floor(n/2), floor(n/4), …, 1`, what is the first gap?

## Explanation

```js
function shellSort(a) {
  const n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const key = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > key) {
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = key;
    }
  }
}
```

Complexity depends on the gap sequence — roughly better than plain `O(n²)` insertion, not as cleanly analyzed as merge sort. In-place; typically **not** stable. Final gap `1` must appear so the array finishes sorted.

## What to observe

- Large gaps fix distant inversions cheaply.
- Gap sequence choice matters more than micro-tuning the inner loop.
- Last pass is insertion sort on almost-ordered data.

## Quick challenge

Why must every useful gap sequence eventually include `1`?
