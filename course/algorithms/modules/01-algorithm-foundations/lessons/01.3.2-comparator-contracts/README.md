<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.3.2-comparator-contracts:README.md -->

# Comparator Contracts

> Graph index: `01.3.2`

## Context

`Array.prototype.sort` and many algorithms need a **comparator**: a function that orders two values. If the contract is broken, sorts misbehave in subtle ways — especially with numbers and multi-key sorts.

## Predict first

What is the order of `nums` after sorting?

```js
const nums = [1, 10, 2];
nums.sort();
console.log(nums);
```

## Explanation

Comparator contract for `(a, b)`:

| Return | Meaning |
|--------|---------|
| `< 0` | `a` comes before `b` |
| `0` | `a` and `b` are equal for ordering |
| `> 0` | `a` comes after `b` |

```js
// Wrong for numbers: default sort converts to strings ("10" before "2")
[1, 10, 2].sort(); // [1, 10, 2]

const nums = [1, 10, 2];
nums.sort((a, b) => a - b); // [1, 2, 10] numeric ascending
```

Rules that keep sorts sane:

- **Consistency**: if `cmp(a,b) < 0` then `cmp(b,a) > 0`
- **Equality**: `cmp(a,a) === 0`
- **Transitivity**: don’t invent rock-paper-scissors orders
- Return `0` for ties so **stable** sorts can preserve input order (engine-dependent historically; modern JS specifies stability)

```js
// Multi-key: sort by score desc, then name asc
rows.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.name.localeCompare(b.name);
});
```

## What to observe

- Default `sort()` without a comparator is almost never what you want for numbers.
- Returning booleans (`a > b`) is not a valid comparator contract.
- Mutating `a`/`b` inside `cmp` is undefined behavior territory — don’t.

## Quick challenge

Write a comparator that sorts strings by length ascending, and for equal length by locale-aware alphabetical order.
