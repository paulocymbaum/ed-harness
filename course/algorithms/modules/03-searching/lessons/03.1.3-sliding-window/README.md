# Sliding Window

> Graph index: `03.1.3`

## Context

A sliding window keeps a contiguous segment `[left, right]` and **slides** it instead of rebuilding from scratch. Fixed-size windows answer "best segment of length `k`"; variable windows grow/shrink until a constraint holds.

## Predict first

For `arr = [2, 1, 5, 1, 3, 2]` and `k = 3`, what is the max sum of any length-`3` window?

```js
// windows: [2,1,5]=8, [1,5,1]=7, [5,1,3]=9, [1,3,2]=6 → 9
```

## Explanation

Fixed window of size `k`:

1. Sum the first `k` elements → `windowSum`, `best = windowSum`
2. For `i = k .. n-1`: `windowSum += arr[i] - arr[i-k]`; update `best`

This is still `O(n)` time and `O(1)` extra space — each index enters and leaves once.

Variable windows adjust `left` when a constraint breaks (e.g. unique chars, sum ≥ target). The invariants differ, but the idea is the same: reuse work from the previous segment.

## What to observe

- Recomputing each window from zero is `O(nk)`; incremental updates are `O(n)`.
- Fixed `k` needs `n >= k`; otherwise there is no valid window.
- Variable windows couple "expand right" with "shrink left" rules — name the invariant.

## Quick challenge

Modify the fixed-window approach to return the **starting index** of the maximum-sum window of size `k` (break ties by smaller index).
