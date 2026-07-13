<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.2.1-merge-sort:README.md -->

# Merge Sort

> Graph index: `02.2.1`

## Context

Merge sort splits the array, sorts each half, then **merges** two sorted runs. Guarantees `O(n log n)` and is stably implementable — the classic efficient comparison sort.

## Predict first

Merging `[1, 4, 7]` and `[2, 3, 8]`, what is the first value written?

## Explanation

```js
function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]); // <= keeps stability
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}
```

`Θ(log n)` split levels × `Θ(n)` merge work → `Θ(n log n)` always. Typical auxiliary space `Θ(n)`. Prefer `<=` from the left run for stability.

## What to observe

- Work lives in merge, not pivot selection.
- Guaranteed `n log n` — no adversarial pivot case.
- Extra buffer memory is the usual tradeoff vs in-place sorts.

## Quick challenge

Why does `left[i] <= right[j]` (not `<`) matter for equal keys?
