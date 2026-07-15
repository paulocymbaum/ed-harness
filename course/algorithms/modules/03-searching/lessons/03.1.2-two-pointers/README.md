# Two Pointers

> Graph index: `03.1.2`

## Context

Two pointers place indices at useful ends (or same-direction walks) and move them by a rule. On a **sorted** array, opposite-end pointers often turn an `O(n²)` nested scan into one `O(n)` pass.

## Predict first

For `nums = [1, 2, 4, 7, 11]` and `target = 9`, after `L=0`, `R=4`:

```js
// sum = 1+11=12 > 9 → move R left
// sum = 1+7=8  < 9 → move L right
// sum = 2+7=9  === target
```

Do you ever need to reset both pointers to the middle?

## Explanation

Opposite-end pair sum (sorted ascending):

1. `L = 0`, `R = n - 1`
2. If `nums[L] + nums[R] === target` → found
3. If sum is too big → `R--` (need a smaller partner)
4. If sum is too small → `L++` (need a larger partner)
5. Stop when `L >= R`

Why it works: sorting fixes relative order, so discarding one end never misses a needed pair that only that side could form with the remaining side.

Same-direction uses (also two pointers): slow/fast for unique compaction, window ends as a special case of the next lesson.

## What to observe

- **Sorted** (or pre-sorted) is the usual prerequisite for opposite-end pair tricks.
- Each step moves exactly one pointer — total steps are `O(n)`.
- Unsorted pair sum needs hashing or sort-then-pointers — different trade-offs.

## Quick challenge

Adapt the opposite-end idea to check whether an array is a palindrome using `L` and `R`. When do you declare failure?
