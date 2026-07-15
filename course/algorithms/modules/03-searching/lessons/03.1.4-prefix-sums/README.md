# Prefix Sums

> Graph index: `03.1.4`

## Context

Prefix sums precompute running totals so any contiguous range sum answers in `O(1)` after `O(n)` setup. This is search-adjacent tooling: you locate answers by querying ranges instead of rescanning.

## Predict first

```js
const arr = [2, 4, 1, 3];
// prefix[0]=0
// prefix[1]=2, prefix[2]=6, prefix[3]=7, prefix[4]=10
// sum(arr[1..3]) = 4+1+3 = 8 = prefix[4]-prefix[1]
```

What is `sum(arr[0..2])` using the prefix formula?

## Explanation

Define `prefix[0] = 0` and `prefix[i] = arr[0] + … + arr[i-1]` for `i ≥ 1`.

Inclusive range `[L, R]` (0-based):

```js
sum(L, R) = prefix[R + 1] - prefix[L];
```

Build once, then answer many queries. Without prefixes, each query is `O(n)`; with them, `O(1)` per query after `O(n)` prep.

Pitfall: off-by-one on exclusive vs inclusive ends — keep the `prefix[0]=0` sentinel so the formula stays uniform.

## What to observe

- Prefix length is `n + 1` when using the sentinel zero.
- Single-element range `[i,i]` → `prefix[i+1] - prefix[i]` (= `arr[i]`).
- 2D / difference arrays are generalizations — same idea: prep then query.

## Quick challenge

Given frequent updates **and** range sums, why is a plain prefix array awkward? What structure family do interviewers mention next?
