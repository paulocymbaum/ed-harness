# Iterating Arrays for and for-of

> Graph index: `01.9.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.2-iterating-arrays-for-and-for-of:README.md -->

## Context

Once you can build an array with literals and indexes (`01.9.1`), you often need to **visit every element**. A classic `for` loop gives you an index; `for...of` gives you each value directly. Later lessons (`filter`, `map`) will hide the loop — this lesson makes the walk explicit first.

## Predict first

What does each line print?

```js
const days = ["Mon", "Tue", "Wed"];

for (let i = 0; i < days.length; i++) {
  console.log(i, days[i]);
}

for (const day of days) {
  console.log(day);
}
```

## Explanation

### Index loop (`for`)

Use a classic `for` when you need the **index** (position) or you want to update by index.

```js
const scores = [10, 20, 30];
let total = 0;

for (let i = 0; i < scores.length; i++) {
  total += scores[i];
}

console.log(total); // 60
```

Pattern: start at `0`, stop when `i < arr.length`, step with `i++`. That visits every dense index exactly once.

### Value loop (`for...of`)

Use `for...of` when you only care about **values**, not positions.

```js
const tags = ["cli", "node", "js"];

for (const tag of tags) {
  console.log(tag.toUpperCase());
}
```

`for...of` walks the iterable in order. You do not get the index unless you build it yourself.

### When you need both index and value

Prefer the index `for`, or track a counter alongside `for...of`:

```js
const names = ["Ada", "Lin"];
let i = 0;

for (const name of names) {
  console.log(i, name);
  i += 1;
}
```

### Building a new list while iterating

You already know how to append with `arr[arr.length] = value`. That works inside a loop:

```js
const nums = [1, 2, 3, 4];
const odds = [];

for (const n of nums) {
  if (n % 2 === 1) {
    odds[odds.length] = n;
  }
}

console.log(odds); // [1, 3]
```

This is the idea behind `filter` — taught next. Here you build the result by hand so the mechanics stay visible.

## What to observe

- `for (let i = 0; i < arr.length; i++)` pairs **index** with `arr[i]`.
- `for (const item of arr)` yields **values**; no index by default.
- Stopping at `i <= arr.length` reads one past the end (`undefined`).
- Mutating `arr.length` while looping can skip or revisit slots — keep length stable unless you intend otherwise.

## Pitfall

```js
const xs = ["a", "b"];

for (const i of xs) {
  console.log(i); // "a", "b" — values, NOT indexes
}
```

`for...of` does not produce `0`, `1`. If you need numbers as indexes, use a classic `for`.

## Quick challenge

Given `const words = ["hi", "", "yo", ""]`, use a `for...of` loop to build `kept` containing only non-empty strings, then print `kept` and `kept.length`.
