<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.1.1-bubble-sort:README.md -->

# Bubble Sort

> Graph index: `02.1.1`

## Context

Bubble sort repeatedly walks adjacent pairs and **swaps** when they are out of order. After each full pass, the next extreme value has "bubbled" toward the end. It is easy to teach, usually slow in practice, and a clear `O(n²)` comparison sort.

## Predict first

For `[3, 1, 2]`, how many adjacent swaps happen in the **first** left-to-right pass that compares `a[i]` with `a[i+1]`?

## Explanation

One ascending pass:

```js
function bubblePass(a) {
  let swaps = 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (a[i] > a[i + 1]) {
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
      swaps++;
    }
  }
  return swaps;
}
```

Full sort runs up to `n - 1` passes, or stops early when a pass makes zero swaps. Worst/average `O(n²)`; best case with early exit `O(n)`. Extra memory is `O(1)`. Bubble sort is **stable** if you swap only when strictly greater.

## What to observe

- Each swap fixes one adjacent inversion.
- Without early exit you still pay `O(n²)` on sorted data.
- Stability comes from never swapping equal keys.

## Quick challenge

Is `[1, 2, 3]` zero-swap after one pass? How many swaps for `[2, 1, 3]`?
