<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.3.1-invariants-and-edge-cases:README.md -->

# Invariants and Edge Cases

> Graph index: `01.3.1`

## Context

Correct algorithms maintain **invariants** — facts that stay true as the loop runs — and handle **edge cases** that break naive assumptions: empty input, one element, duplicates, already sorted, all equal.

## Predict first

What’s wrong with this “max” for some inputs?

```js
function max(arr) {
  let m = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > m) m = arr[i];
  }
  return m;
}
```

## Explanation

**Invariant** (example for linear search with index `i`):

> All elements before `i` have been examined and none equaled `target`.

When the loop ends, the invariant plus the exit condition give the result.

**Edge cases to list before coding:**

| Case | Why it bites |
|------|----------------|
| `[]` empty | `arr[0]` is `undefined`; loops may not run |
| Single element | Off-by-one in `lo`/`hi` or `i < n - 1` |
| Duplicates | First vs last occurrence; stability later |
| All equal | Pivot / partition degenerates |
| Sorted / reverse sorted | Exposes worst-case sorts |

```js
function maxSafe(arr) {
  if (arr.length === 0) {
    throw new Error("empty");
  }
  let m = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > m) m = arr[i];
  }
  return m;
}
```

Write the edge-case list first; then pick invariants that survive them.

## What to observe

- Failing empty input is the most common silent bug in interview code.
- An invariant should be checkable after every iteration — good for debugging.
- Duplicates are not “noise”; they change binary-search bounds and sort stability.

## Quick challenge

State a loop invariant for “reverse an array in place with two indexes `lo` and `hi`.” What are the edge cases?
