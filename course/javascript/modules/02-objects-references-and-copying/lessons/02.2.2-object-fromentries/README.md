# Object.fromEntries

> Graph index: `02.2.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.2.2-object-fromentries:README.md -->

## Context

`Object.fromEntries` is the inverse of `Object.entries`: it builds an object from an iterable of `[key, value]` pairs. That makes “map / filter / then rebuild” a clean pattern.

## Predict first

What prints?

```js
const pairs = [
  ["name", "Ada"],
  ["age", 36],
];
console.log(Object.fromEntries(pairs));
```

## Explanation

Round-trip with entries:

```js
const user = { name: "Ada", age: 36 };
const pairs = Object.entries(user);
const again = Object.fromEntries(pairs);
// again => { name: "Ada", age: 36 }
```

Filter keys, then rebuild:

```js
const raw = { id: 1, name: "Ada", password: "secret" };
const publicUser = Object.fromEntries(
  Object.entries(raw).filter(([key]) => key !== "password"),
);
// { id: 1, name: "Ada" }
```

Works with a `Map` too:

```js
const map = new Map([
  ["x", 1],
  ["y", 2],
]);
Object.fromEntries(map); // { x: 1, y: 2 }
```

## What to observe

- Each pair must be like `[key, value]` (array-like with length ≥ 2).
- Duplicate keys: the **last** pair wins.
- Keys are coerced to strings (except Symbols, which stay Symbols).

## Pitfall

```js
Object.fromEntries([
  ["a", 1],
  ["a", 2],
]);
// { a: 2 } — silent overwrite, no error
```

## Quick challenge

Start from `{ a: 1, b: 2, c: 3 }`. Produce `{ a: 2, b: 4, c: 6 }` using `entries` → `map` → `fromEntries` (double every value).
