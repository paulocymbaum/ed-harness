# Combining filter and map

> Graph index: `01.9.5`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.5-combining-filter-and-map:README.md -->

## Context

You can **keep** with `filter` (`01.9.3`) and **transform** with `map` (`01.9.4`). Real tasks usually need both: keep the useful rows, then shape what you print or store. Chain them left to right — each method returns a new array for the next step.

## Predict first

What does each line print?

```js
const scores = [40, 72, 91, 55];
const labels = scores.filter((s) => s >= 60).map((s) => "Pass:" + s);
console.log(labels);

const words = ["", "hi", "", "bye"];
console.log(words.filter((w) => w.length > 0).map((w) => w.toUpperCase()));
```

## Explanation

### Filter then map (the common order)

Keep first so you do not transform rows you will throw away.

```js
const products = [
  { name: "Notebook", inStock: true },
  { name: "Monitor", inStock: false },
  { name: "Pen", inStock: true },
];

function isInStock(p) {
  return p.inStock === true;
}

function toName(p) {
  return p.name;
}

const names = products.filter(isInStock).map(toName);
console.log(names); // ["Notebook", "Pen"]
```

### Order matters

```js
const nums = [1, 2, 3, 4];

// keep evens, then double → [4, 8]
console.log(nums.filter((n) => n % 2 === 0).map((n) => n * 2));

// double everything, then keep evens → [2, 4, 6, 8]
console.log(nums.map((n) => n * 2).filter((n) => n % 2 === 0));
```

Same tools, different meaning. Decide: "which rows matter?" before "how should each look?"

### Named helpers keep pipelines readable

```js
const isPassing = (s) => s >= 60;
const labelPass = (s) => "Pass:" + s;

const report = [40, 72, 91].filter(isPassing).map(labelPass);
console.log(report); // ["Pass:72", "Pass:91"]
```

Prefer small named functions over a long inline chain when the project grows.

### Intermediate arrays

Each step allocates a new array. That is fine at fundamentals scale. You are not required to fuse filter+map into one loop yet — clarity first.

## What to observe

- Chain reads left → right: `arr.filter(...).map(...)`.
- Filter length can shrink; map after filter keeps that new length.
- Neither step mutates the original `arr`.
- Map-then-filter is valid when the keep-rule depends on the transformed value.

## Pitfall

```js
const xs = [1, 2, 3];
xs.filter((n) => n > 1).map((n) => n * 10);
console.log(xs); // still [1, 2, 3] — assign the chain to a variable
```

## Quick challenge

Using the `products` list from the explanation, write `inStockNames(products)` with named `isInStock` and `toName`, returning only in-stock names. Empty input → `[]`.
