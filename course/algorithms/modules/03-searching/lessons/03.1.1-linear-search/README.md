# Linear Search

> Graph index: `03.1.1`

## Context

Linear search walks an array from the left until it finds the target (or runs out of elements). It needs **no sorted order**, which makes it the default when you cannot binary-search.

## Predict first

What does this print for `arr = [4, 9, 2, 9]` and `target = 9`?

```js
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
console.log(linearSearch(arr, target));
```

## Explanation

The loop compares `arr[i]` to `target` in order. The first success returns immediately, so duplicates after that index are ignored. If nothing matches, return `-1`.

| Case | Work |
|------|------|
| Target at index 0 | 1 comparison — best case |
| Target missing | `n` comparisons — worst case |
| Average (uniform) | ~`n/2` comparisons |

Time is `O(n)`, extra space `O(1)` (besides the input).

```js
// Correct: stop at first hit
linearSearch([1, 7, 7], 7); // 1

// Wrong mental model: "always check every element"
// Returning early is still linear search — and required for "first index".
```

## What to observe

- No sorting prerequisite — works on any list.
- Early exit does **not** change Big-O class: still `O(n)` worst case.
- "Find all matches" is a different problem (collect indices while scanning).

## Quick challenge

Change the function to return the **last** index of `target` instead of the first. What must change in the loop?
