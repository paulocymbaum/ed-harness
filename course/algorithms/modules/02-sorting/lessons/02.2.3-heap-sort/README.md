<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.2.3-heap-sort:README.md -->

# Heap Sort

> Graph index: `02.2.3`

## Context

Heap sort turns the array into a binary **heap**, then repeatedly extracts the max (or min) into the sorted suffix. Guarantees `O(n log n)` time with `O(1)` auxiliary array space — useful under memory pressure when merge sort’s buffer is costly.

## Predict first

In a 0-based binary heap, what are the children indices of node `1`?

## Explanation

Index math (0-based):

- parent(`i`) = `Math.floor((i - 1) / 2)`
- left(`i`) = `2*i + 1`
- right(`i`) = `2*i + 2`

```js
function heapify(a, n, i) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && a[l] > a[largest]) largest = l;
  if (r < n && a[r] > a[largest]) largest = r;
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    heapify(a, n, largest);
  }
}
```

Build-heap is `O(n)`; `n` extract-max steps are `O(n log n)`. Not stable. In-place aside from recursion/stack depending on implementation.

## What to observe

- Heap index formulas are the navigation API.
- Guaranteed `n log n` without merge buffers.
- Cache behavior often worse than quicksort in practice.

## Quick challenge

For node index `0`, name left and right child indices.
