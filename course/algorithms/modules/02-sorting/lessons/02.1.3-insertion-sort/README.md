<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.1.3-insertion-sort:README.md -->

# Insertion Sort

> Graph index: `02.1.3`

## Context

Insertion sort grows a sorted prefix. Each new key **shifts** larger elements right until its slot appears. Strong on nearly sorted data and a building block for shell sort and hybrid library sorts.

## Predict first

Sorted prefix `[1, 3, 5]` and key `2`: at which index should `2` be inserted?

## Explanation

```js
function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}
```

Worst/average `O(n²)`; best case sorted `O(n)`. Stable when you shift only while `a[j] > key`. Feels "online": new items insert into a growing sorted list.

## What to observe

- The insert index is where the key belongs in the prefix.
- Shifts (not swaps) keep stability natural.
- Few inversions → few shifts → nearly linear.

## Quick challenge

How many shifts insert `0` into `[1, 2, 3]`?
