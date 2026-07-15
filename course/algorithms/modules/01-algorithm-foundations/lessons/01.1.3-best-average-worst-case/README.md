<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.1.3-best-average-worst-case:README.md -->

# Best Average Worst Case

> Graph index: `01.1.3`

## Context

One Big-O label is not enough when performance depends on **input shape**. Algorithms can be fast on lucky inputs and slow on adversarial ones. Interviews often ask for worst case; production cares about typical (average) traffic too.

## Predict first

A linear search looks for `target` in `arr`. When is it fastest? When is it slowest?

```js
function findIndex(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
```

## Explanation

For the same algorithm:

| Case | Meaning | Linear search |
|------|---------|---------------|
| **Best** | Most favorable input | Target at index `0` → `O(1)` comparisons |
| **Worst** | Least favorable | Missing / last element → `O(n)` |
| **Average** | Typical over a distribution | Often ~`O(n)` if target is equally likely anywhere |

Quick Sort (preview for the Sorting module) is the classic teaching example:

- **Average** ~`O(n log n)` with random-ish pivots
- **Worst** `O(n²)` when pivots are consistently terrible (e.g. already sorted + always pick first)

```js
// Same code path; cost still depends on data
function earlyExitSum(arr, limit) {
  let s = 0;
  for (const x of arr) {
    s += x;
    if (s > limit) return s; // best: trip early; worst: scan all
  }
  return s;
}
```

When you say “this is `O(n)`,” clarify **which case** unless the bound is the same for all inputs (like a fixed double loop).

## What to observe

- Worst-case guarantees matter for latency SLAs and adversarial inputs.
- Average-case needs an assumed distribution — “average” is not magic.
- Best-case alone is a weak argument for choosing an algorithm.

## Quick challenge

For binary search on a sorted array of length `n`, what are best and worst case in Big-O? Does the average match the worst?
