<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.4.2-custom-comparators:README.md -->

# Custom Comparators

> Graph index: `02.4.2`

## Context

A comparator `(a, b) => number` tells `sort` the order: negative if `a` before `b`, positive if `a` after `b`, `0` if equal. Broken comparators (non-transitive, unstable signs, returning booleans) produce wrong or engine-dependent results.

## Predict first

For ascending numbers, what should `(3, 5)` return — negative, zero, or positive?

## Explanation

```js
const asc = (a, b) => a - b;
const desc = (a, b) => b - a;
// NEVER: (a, b) => a > b  // boolean coerces badly
```

Contract: `compare(a,a) === 0`; if `compare(a,b) < 0` then `compare(b,a) > 0`; transitivity expected. Returning `NaN` or non-numbers is undefined territory. For strings use `a.localeCompare(b)` when locale matters.

## What to observe

- Sign matters; magnitude usually does not (except overflow edge cases with huge ints).
- Boolean comparators are a classic interview footgun.
- Consistency across the whole set beats clever one-off logic.

## Quick challenge

What goes wrong with `(a, b) => a > b` under `sort`?
