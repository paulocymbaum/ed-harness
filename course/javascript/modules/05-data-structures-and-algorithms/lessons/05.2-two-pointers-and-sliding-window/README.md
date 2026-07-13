# Two Pointers and Sliding Window

> Graph index: `05.2`

## Context

Many array/string problems that look like they need nested loops (O(n²)) can be solved in a single pass (O(n)) with **two pointers** — one moving from each end, or one "window" of pointers sliding together. The trick applies whenever the input has useful order (sorted, or a contiguous window matters) so you can discard possibilities without re-checking them.

## Two pointers on a sorted array

```js
// Find a pair that sums to target in a SORTED array — O(n), not O(n^2)
function twoSum(sortedArr, target) {
  let left = 0, right = sortedArr.length - 1;
  while (left < right) {
    const sum = sortedArr[left] + sortedArr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;   // sum too small: grow it
    else right--;               // sum too big: shrink it
  }
  return null;
}
```

## Sliding window on a contiguous range

```js
// Longest substring without repeating characters — O(n)
function longestUnique(s) {
  const seen = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

## Predict first

For `twoSum([1, 3, 5, 8, 11], 12)`, trace `left`/`right` step by step. Which pair is returned, and after how many comparisons?

## What to observe

- `left` only moves right, `right` only moves left (or forward) — each pointer makes **at most n moves total**, giving O(n) instead of O(n²).
- On a **sorted** array, comparing `sum` to `target` tells you which pointer to move — no need to re-check pairs you've already ruled out.
- Sliding window keeps a **contiguous** range `[left, right]`; shrinking from the left never "loses" a valid answer because anything smaller was already considered.
- Both patterns trade nested loops for a single pass with smart pointer movement — the array's order or window property is what makes this safe.
- If the array is **unsorted** and order doesn't help, two pointers from each end does not apply directly (you'd sort first, or use a hash map instead).

## Mini-exercise

Predict the two-pointer indices two-sum would return for `[2, 7, 11, 15]` with `target = 9`. Then trace a sliding window that finds the longest run of the same character in `"aaabbbccd"`.
