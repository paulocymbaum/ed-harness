# Other Non-mutating Array Methods

> Graph index: `01.9.8`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.8-other-non-mutating-array-methods:README.md -->

## Context

You already know non-mutating **transforms** (`filter`, `map`) and uniqueness (`Set`). This lesson covers other everyday helpers that return information or a **new** array **without** changing the original: `slice`, `concat`, `includes`, `indexOf`, `find`, `findIndex`, and `join`.

## Predict first

What does each line print?

```js
const xs = ["a", "b", "c", "d"];
console.log(xs.slice(1, 3));
console.log(xs);

console.log(xs.concat(["e"]));
console.log(xs.includes("b"), xs.indexOf("z"));

const nums = [5, 12, 8];
console.log(nums.find((n) => n > 10));
console.log(nums.join("-"));
```

## Explanation

### `slice` — copy a range

```js
const days = ["Mon", "Tue", "Wed", "Thu"];
const mid = days.slice(1, 3); // start inclusive, end exclusive
console.log(mid); // ["Tue", "Wed"]
console.log(days); // unchanged

const copy = days.slice(); // shallow copy of all elements
```

### `concat` — glue into a new array

```js
const a = [1, 2];
const b = a.concat([3], [4, 5]);
console.log(b); // [1, 2, 3, 4, 5]
console.log(a); // [1, 2]
```

### Membership: `includes` / `indexOf`

```js
const tags = ["js", "node"];
console.log(tags.includes("node")); // true
console.log(tags.indexOf("node")); // 1
console.log(tags.indexOf("rust")); // -1
```

Prefer `includes` for yes/no. Use `indexOf` when you need the position. For heavy membership workloads you already saw `Set.has` (`01.9.6`).

### `find` / `findIndex`

Like a "filter first match only":

```js
const users = [
  { id: 1, name: "Ada" },
  { id: 2, name: "Lin" },
];

console.log(users.find((u) => u.id === 2)); // { id: 2, name: "Lin" }
console.log(users.findIndex((u) => u.id === 9)); // -1
```

`find` returns `undefined` when nothing matches.

### `join` — array to string

```js
console.log(["a", "b", "c"].join(", ")); // "a, b, c"
console.log([1, 2, 3].join("")); // "123"
```

## What to observe

- None of these methods mutate the receiver (contrast `splice` / `push` from `01.9.7`).
- `slice(start, end)` end is exclusive; omit `end` to copy through the last element.
- `find` returns an element; `filter` returns an array — different tools.
- `map` / `filter` stay in `01.9.3`–`01.9.5`; this lesson does not re-teach them.

## Pitfall

```js
const xs = [1, 2, 3];
console.log(xs.slice(1, 1)); // [] — start === end copies nothing
console.log(xs.slice(1, 2)); // [2]
```

## Quick challenge

Given `const line = ["error", "warn", "info", "debug"]`, use non-mutating methods only to: (1) copy the middle two levels with `slice`, (2) check `includes("error")` on the original, (3) `join` the copy with `" | "`. Print those three results.
