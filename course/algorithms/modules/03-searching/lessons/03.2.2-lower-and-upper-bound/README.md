# Lower and Upper Bound

> Graph index: `03.2.2`

## Context

Equality binary search is ambiguous with duplicates. **Lower bound** is the first index where `arr[i] >= target`. **Upper bound** is the first index where `arr[i] > target`. Together they delimit the half-open range of equals: `[lower, upper)`.

## Predict first

`arr = [1, 2, 2, 2, 5]`, `target = 2`:

- lower bound → index `1`
- upper bound → index `4`
- equals live in `[1, 4)`

What is lower bound of `3`?

## Explanation

Lower-bound template (returns insert position):

```js
function lowerBound(a, target) {
  let lo = 0, hi = a.length; // hi exclusive
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (a[mid] < target) lo = mid + 1;
    else hi = mid; // mid could still be the first >=
  }
  return lo;
}
```

Upper bound uses `a[mid] <= target` → `lo = mid + 1`, else `hi = mid`.

These answers stay useful even when the target is missing: lower bound becomes the insert index to keep sorted order.

## What to observe

- Exclusive `hi = n` in the template is deliberate — avoids special-casing "past the end".
- Count of `target` = `upper - lower`.
- Do not return on first equality if you need the **leftmost** index.

## Quick challenge

Write upper bound from the lower-bound skeleton. What single comparison flips?
