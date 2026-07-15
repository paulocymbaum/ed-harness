<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.4.1-array-prototype-sort:README.md -->

# Array.prototype.sort

> Graph index: `02.4.1`

## Context

In JavaScript, `Array.prototype.sort` sorts **in place** and returns the same array. With no compare function, elements are converted to strings and ordered **lexicographically** by UTF-16 code units — so numeric arrays often look "wrong" until you pass a comparator.

## Predict first

What is `[10, 2, 1].sort()` without a comparator?

## Explanation

```js
[10, 2, 1].sort();           // [1, 10, 2] — string order: "1","10","2"
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
```

Modern engines use efficient hybrid sorts; ECMAScript now requires **stability**, but you should still reason about comparators carefully. `sort` mutates; copy first (`[...arr].sort(...)`) when callers need the original order.

## What to observe

- Default sort is not numeric.
- Mutation surprises shared references.
- Always pass `(a, b) => a - b` (or explicit compare) for numbers.

## Quick challenge

Why is `"10" < "2"` true as strings but false as numbers?
