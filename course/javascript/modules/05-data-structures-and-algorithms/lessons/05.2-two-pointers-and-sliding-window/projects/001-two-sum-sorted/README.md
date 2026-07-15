# Two Sum Sorted

## Problem context

A pricing tool has a sorted list of unique discount amounts and needs to find two discounts that combine to hit an exact promotional target, without scanning every possible pair — the list can be large, so an `O(n)` scan beats an `O(n^2)` brute force.

## Goal

Read a sorted array of unique integers and a target from stdin, and print the 0-based indices of the two elements that sum to the target using the two-pointer technique, or `none` if no pair exists.

## Lesson concepts practiced
- [ ] `left` starts at index `0`, `right` starts at the last index; each pointer only moves toward the other.
- [ ] On a sorted array, comparing the current sum to the target tells you which pointer to move.
- [ ] Both pointers together make at most `n` moves total, giving `O(n)` instead of checking every pair (`O(n^2)`).

## Functional requirements
- [ ] Read line 1: sorted, unique integers separated by single spaces
- [ ] Read line 2: the integer target
- [ ] Use two pointers (`left` at start, `right` at end) to find a pair summing to target
- [ ] If found, print the two 0-based indices in ascending order, separated by a single space
- [ ] If no pair sums to target, print `none`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `twoSumSortedIndices(arr, target)` helper is enough
- [ ] Error handling: malformed input may throw (no special requirement)
- [ ] Performance: use the two-pointer scan — do **not** use a nested loop over all pairs

## Constraints
- [ ] Node.js only — no external libraries
- [ ] The input array is already sorted ascending and contains no duplicate values
- [ ] Assume at most one valid pair exists in the input
- [ ] Do not sort the array yourself — it is already sorted

## Acceptance criteria
- [ ] Kind `sorted array with a valid pair` → stdout `"<leftIndex> <rightIndex>"`
- [ ] Kind `sorted array with no valid pair` → stdout `none`
- [ ] Kind `target equal to the sum of the two smallest elements` → stdout the first two indices
- [ ] Kind `target equal to the sum of the two largest elements` → stdout the last two indices

## Example data

Input:
```text
1 3 5 8 11
12
```

Output:
```text
1 3
```

Input:
```text
2 7 11 15
9
```

Output:
```text
0 1
```

Input:
```text
1 2 3
100
```

Output:
```text
none
```

## Suggested plan (no solution)
1. Read line 1 into an array of numbers and line 2 into a `target` number.
2. Set `left = 0` and `right = arr.length - 1`.
3. Loop while `left < right`: compare `arr[left] + arr[right]` to `target` and move the pointer that gets you closer (increase sum → move `left` right; decrease sum → move `right` left).
4. Print the pair of indices when found, or `none` once `left` and `right` cross without a match.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support multiple valid pairs and print all of them, one per line
- [ ] Handle an unsorted input by sorting first while tracking original indices
