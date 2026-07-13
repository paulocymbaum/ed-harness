# Sliding Window Max Sum

## Problem context

A monitoring dashboard tracks per-minute request counts and needs the busiest contiguous `k`-minute stretch to size autoscaling. Recomputing the sum of every window from scratch is `O(n * k)`; sliding the window and adjusting the running sum by one element at a time is `O(n)`.

## Goal

Read an array of integers and a window size `k` from stdin, then print the maximum sum of any contiguous window of length `k`. If `k` is invalid for the given array, print `ERROR` instead.

## Lesson concepts practiced
- [ ] A sliding window reuses the previous window's sum instead of recomputing it, turning a nested-loop scan into a single pass
- [ ] The window only ever adds the new right-hand element and removes the old left-hand element as it slides — `O(1)` work per step
- [ ] Recognizing when `k` makes the window invalid (`k < 1` or `k > n`) before attempting the slide
- [ ] The sliding window is `O(n)` overall versus `O(n * k)` for recomputing each window's sum independently

## Functional requirements
- [ ] Read line 1: space-separated integers (the array; may contain negative numbers)
- [ ] Read line 2: the integer window size `k`
- [ ] Let `n` be the number of integers read from line 1
- [ ] If `k < 1` or `k > n`, print `ERROR` and stop
- [ ] Otherwise, compute the sum of every contiguous window of exactly `k` elements and print the maximum such sum
- [ ] Use a sliding window (running sum) rather than recomputing each window's sum from scratch
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `maxWindowSum(numbers, k)` helper is enough
- [ ] Error handling: invalid `k` prints `ERROR` instead of throwing or printing `NaN`/`undefined`
- [ ] Performance: `O(n)` time — do not recompute the sum of each window with a nested loop

## Constraints
- [ ] Node.js only — no external libraries
- [ ] The array may contain negative numbers, zero, or all-negative values
- [ ] `k` may be `0` or negative, or greater than `n` — both are invalid
- [ ] When `k` equals `n`, the only valid window is the whole array

## Acceptance criteria
- [ ] Array `2 1 5 1 3 2`, `k = 3` → stdout `9` (window `[5, 1, 3]`)
- [ ] Array `1 2 3`, `k = 5` (k > n) → stdout `ERROR`
- [ ] Array `1 2 3`, `k = 0` (k < 1) → stdout `ERROR`
- [ ] Array `-1 -2 -3 -4`, `k = 2` → stdout `-3` (best of all-negative windows)
- [ ] Array `4 5 6`, `k = 3` (k equals n) → stdout `15` (whole array is the only window)

## Example data

Input:
```text
2 1 5 1 3 2
3
```

Output:
```text
9
```

Input:
```text
1 2 3
5
```

Output:
```text
ERROR
```

## Suggested plan (no solution)
1. Read line 1 into an array of numbers; read line 2 into `k`.
2. If `k < 1` or `k > numbers.length`, print `ERROR` and stop.
3. Compute the sum of the first `k` elements as the initial window sum and track it as the current best.
4. Slide the window one step at a time: add the new element entering on the right, subtract the element leaving on the left, and update the best sum if the new window sum is higher.
5. Print the best sum found after sliding through the whole array.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print the starting index of the best window
- [ ] Support finding the maximum sum for every `k` from `1` to `n` in a single run
