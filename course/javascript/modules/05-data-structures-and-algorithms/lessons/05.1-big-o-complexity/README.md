# Big-O Complexity

> Graph index: `05.1`

## Context

Big-O describes how an algorithm's running time (or memory) **scales** as the input size `n` grows — it ignores constant factors and lower-order terms. Interviewers use it as shorthand: "your solution is O(n²), can you get it to O(n log n)?" Recognizing the shape of a piece of code (one loop? nested loops? halving each step?) is a fast, reusable skill for any coding round.

## Four shapes you must recognize

```js
// O(1) — constant: no loop, work independent of n
function first(arr) {
  return arr[0];
}
```

```js
// O(n) — single loop: work grows linearly with n
function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) total += arr[i];
  return total;
}
```

```js
// O(n²) — nested loop: work grows with n * n
function hasDuplicatePair(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```

```js
// O(log n) — binary search: each step halves the remaining range
function binarySearch(sortedArr, target) {
  let lo = 0, hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

## Predict first

For an array of size `n = 1000`, roughly how many operations does each function above perform? Order them from fastest-growing to slowest-growing as `n` doubles.

## What to observe

- A single loop over the input is **O(n)** — work doubles when `n` doubles.
- A loop nested inside another loop (over the same input) is **O(n²)** — work roughly quadruples when `n` doubles.
- Halving the search range every step (binary search) is **O(log n)** — work grows by only one step when `n` doubles.
- No loop, no recursion, fixed number of operations is **O(1)** — work stays flat regardless of `n`.
- Big-O drops constants and lower-order terms: `3n + 100` is still **O(n)**, not "O(3n)".

## Mini-exercise

Classify each snippet as `O(1)`, `O(n)`, `O(n^2)`, or `O(log n)`:

```js
function a(arr) { return arr.length > 0; }                    // ?
function b(arr) { for (const x of arr) console.log(x); }      // ?
function c(arr) { for (const x of arr) for (const y of arr) {} } // ?
function d(n) { while (n > 1) n = Math.floor(n / 2); }         // ?
```
