# Binary Search

> Graph index: `03.2.1`

## Context

Binary search finds a target in a **sorted** array by comparing the middle element and discarding half the remaining range each step. That `O(log n)` behavior beats linear scanning when order is guaranteed.

## Predict first

```js
const a = [1, 3, 5, 7, 9];
// target 7: mid → 5 (too small) → search right half → find 7
```

How many comparisons to prove `6` is missing?

## Explanation

Classic loop (inclusive bounds):

```js
function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

Invariants: if the target exists, it lies in `[lo, hi]`. Empty interval ⇒ missing.

Prefer `lo + ((hi-lo)>>1)` over `(lo+hi)/2` to avoid overflow habits from other languages (still good style in JS).

## What to observe

- Unsorted input → wrong answers; sorting first costs `O(n log n)`.
- Duplicates: classic equality return may not be the first occurrence (lower bound is next lesson).
- Off-by-one on `lo`/`hi` updates is the main bug class.

## Quick challenge

Trace `binarySearch([2,4,6,8], 5)` step by step until `-1`. List `lo`, `hi`, `mid` each iteration.
