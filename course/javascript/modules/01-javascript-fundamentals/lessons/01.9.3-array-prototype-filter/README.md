# Array.prototype.filter

> Graph index: `01.9.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.3-array-prototype-filter:README.md -->

## Context

In `01.9.2` you kept some items with a loop and a hand-built result array. **`filter`** does the same job with a callback: walk the array, keep elements where your function returns a truthy value, and return a **new** array. The original list is not changed.

You already met callbacks and arrows in `01.7.3`. This lesson focuses only on **keeping** — transforming values is `map` in `01.9.4`.

## Predict first

What does each line print?

```js
const scores = [40, 72, 91, 55];
const passing = scores.filter((s) => s >= 60);
console.log(passing);
console.log(scores);

const words = ["", "hi", "", "bye"];
console.log(words.filter((w) => w.length > 0));
```

## Explanation

### Keep by predicate

A **predicate** is a function that answers yes/no for one element. `filter` calls it once per item and keeps the item when the return value is truthy.

```js
const nums = [1, 2, 3, 4, 5, 6];

function isEven(n) {
  return n % 2 === 0;
}

const evens = nums.filter(isEven);
console.log(evens); // [2, 4, 6]
```

Named functions work the same as arrows — pass the function value, do not call it yourself (`isEven`, not `isEven()`).

### New array, same element values

`filter` does not copy-transform the kept values; it places the **same** elements into a new array (for objects, that means the same references).

```js
const tags = ["a", "bb", "c"];
const short = tags.filter((t) => t.length === 1);
console.log(short); // ["a", "c"]
console.log(tags); // ["a", "bb", "c"] — unchanged
```

### Empty result is allowed

If nothing passes, you get `[]` — not an error.

```js
console.log([1, 2, 3].filter((n) => n > 10)); // []
```

### Truthiness pitfall

The callback's return is converted like an `if` test. Returning the element itself can accidentally drop falsy values you meant to keep.

```js
const mixed = [0, 1, 2];
console.log(mixed.filter((n) => n)); // [1, 2] — 0 dropped because falsy
console.log(mixed.filter((n) => n !== undefined)); // keeps 0
```

Prefer an explicit boolean when "keep zeros" matters: `(n) => n >= 0`.

## What to observe

- Result length is **≤** input length.
- Original array is **not** mutated.
- Callback receives `(element, index, array)` — you usually only need `element`.
- Returning a non-boolean still works via truthiness; be deliberate with `0`, `""`, and `null`.

## Pitfall

```js
const xs = [1, 2, 3];
xs.filter((n) => n > 1);
console.log(xs); // still [1, 2, 3] — you must use the returned array
```

## Quick challenge

From `const products = [{ name: "Pen", inStock: true }, { name: "Mug", inStock: false }]`, use `filter` and a named `isInStock` helper. Print the **filtered product objects** with `console.log` (mapping names comes in `01.9.4`).
