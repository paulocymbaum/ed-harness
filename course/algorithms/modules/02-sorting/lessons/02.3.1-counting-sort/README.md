<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.3.1-counting-sort:README.md -->

# Counting Sort

> Graph index: `02.3.1`

## Context

Counting sort is a **non-comparison** sort for integers in a known small range. Count occurrences, then emit values in order. Time `O(n + k)` where `k` is the value range — excellent when `k` is tiny relative to `n`.

## Predict first

Values in `[3, 1, 3]` with min `1` and max `3`: how large is the count array indexed by `value - min`?

## Explanation

```js
function countingSort(a, min, max) {
  const k = max - min + 1;
  const count = Array(k).fill(0);
  for (const x of a) count[x - min]++;
  const out = [];
  for (let v = 0; v < k; v++) {
    for (let c = 0; c < count[v]; c++) out.push(v + min);
  }
  return out;
}
```

Needs `O(k)` (and often `O(n)`) extra memory. Not useful for huge / sparse ranges or arbitrary floats/strings without digit tricks (see radix). Can be made **stable** with prefix sums writing into an output buffer from the right.

## What to observe

- Cost tracks `n + k`, not `n log n` comparisons.
- Range size dominates when `k >> n`.
- Stability needs careful placement, not the naive double loop alone.

## Quick challenge

Why is counting sort a poor fit for sorting 64-bit IDs spanning the full integer domain?
