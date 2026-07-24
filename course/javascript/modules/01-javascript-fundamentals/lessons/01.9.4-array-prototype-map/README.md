# Array.prototype.map

> Graph index: `01.9.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.4-array-prototype-map:README.md -->

## Context

`filter` (`01.9.3`) **keeps** some elements. **`map`** **transforms** every element: one callback call per item, and each return value becomes the item at that index in a **new** array of the **same length**. The original array stays unchanged.

## Predict first

What does each line print?

```js
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
console.log(doubled);
console.log(nums);

const words = ["hi", "yo"];
console.log(words.map((w) => w.toUpperCase()));
console.log([1, 2, 3].map(String));
```

## Explanation

### One output per input

```js
const prices = [10, 20, 30];

function withTax(p) {
  return p * 1.1;
}

const taxed = prices.map(withTax);
console.log(taxed); // [11, 22, 33]
console.log(taxed.length === prices.length); // true
```

If you need fewer items, filter first (next lesson) or filter alone — do not use `map` to drop elements by returning `undefined` unless you truly want `undefined` slots.

### Named helpers and method references

```js
const labels = [1, 2, 3].map((n) => "n=" + n);
console.log(labels); // ["n=1", "n=2", "n=3"]

console.log([1, 2, 3].map(String)); // ["1", "2", "3"]
```

`map(String)` works because `String` is a function that accepts one argument. Prefer a named helper when the transform is more than a single built-in.

### Mapping objects to fields

```js
const people = [
  { name: "Ada", role: "eng" },
  { name: "Lin", role: "ops" },
];

const names = people.map((p) => p.name);
console.log(names); // ["Ada", "Lin"]
```

You still have one output per person — here each output is a string instead of an object.

### `map` does not mutate

```js
const xs = [1, 2, 3];
xs.map((n) => n * 10);
console.log(xs); // [1, 2, 3]
```

Capture the return value.

## What to observe

- Result length **always equals** input length.
- Original array is **not** mutated.
- Callback return value **is** the new element (unlike `filter`, which keeps or drops the old one).
- Callback signature is `(element, index, array)` — index is useful for position-aware labels.

## Pitfall

```js
const nums = [1, 2, 3];
const oops = nums.map((n) => {
  n * 2; // missing return in a block body
});
console.log(oops); // [undefined, undefined, undefined]
```

Expression-body arrows return automatically: `(n) => n * 2`. Block bodies need `return`.

## Quick challenge

Write `doubleAll(nums)` that returns each number × 2 using `map` and a named `double` helper. Check `doubleAll([1, 2, 3])` → `[2, 4, 6]` and `doubleAll([])` → `[]`.
