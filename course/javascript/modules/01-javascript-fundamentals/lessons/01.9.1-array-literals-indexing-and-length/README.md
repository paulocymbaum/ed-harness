# Array Literals Indexing and length

> Graph index: `01.9.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.1-array-literals-indexing-and-length:README.md -->

## Context

An **array** is an ordered list of values. You create one with an **array literal** (`[]`), read or write items by **index** (starting at `0`), and use **`.length`** for how many slots the array currently reports.

This lesson stays on literals, indexing, and `length`. Next you iterate with `for` / `for...of` (`01.9.2`), then learn `filter`, `map`, pipelines, `Set`, mutating helpers, and other non-mutating helpers in that order.

## Predict first

What does each line print?

```js
const fruits = ["apple", "banana", "cherry"];

console.log(fruits[0]);
console.log(fruits[2]);
console.log(fruits[3]);
console.log(fruits.length);

fruits[1] = "blueberry";
console.log(fruits);
console.log(fruits.length);

fruits[3] = "date";
console.log(fruits.length);
console.log(fruits[3]);
```

## Explanation

### Array literals

Square brackets create an array. Items are separated by commas. Values can be any type, and mixed types are allowed (though usually you keep one shape).

```js
const empty = [];
const nums = [10, 20, 30];
const mixed = ["hi", 1, true, null];
```

### Zero-based indexing

The first item is at index `0`, the second at `1`, and so on. The last item of a non-empty array is at index `length - 1`.

```js
const colors = ["red", "green", "blue"];
console.log(colors[0]); // "red"
console.log(colors[1]); // "green"
console.log(colors[colors.length - 1]); // "blue"
```

Reading an index that does not exist returns `undefined` — it does not throw.

```js
console.log(colors[99]); // undefined
```

### Writing by index

Assignment updates an existing slot, or creates a new one if the index is beyond the current end.

```js
const scores = [7, 8, 9];
scores[0] = 10;
console.log(scores); // [10, 8, 9]

scores[3] = 11;
console.log(scores); // [10, 8, 9, 11]
console.log(scores.length); // 4
```

### `length`

`.length` is the number of elements the array reports. It updates when you extend the array by writing past the end.

You can also set `.length` yourself:

```js
const letters = ["a", "b", "c", "d"];
letters.length = 2;
console.log(letters); // ["a", "b"]
console.log(letters[2]); // undefined
```

Shortening `length` drops trailing elements. Growing `length` without filling slots creates empty holes (sparse array) — prefer writing concrete values when you add items.

### Nested access (brief)

Arrays can hold other arrays. Use chained indexes carefully.

```js
const grid = [
  [1, 2],
  [3, 4],
];
console.log(grid[0][1]); // 2
console.log(grid[1][0]); // 3
```

## What to observe

- Indexes start at `0`, not `1`.
- `arr[i]` for a missing index is `undefined`, not an error.
- `arr.length` is one past the last valid index for a dense array (`lastIndex === length - 1`).
- Writing `arr[arr.length] = value` appends one item and grows `length` by 1.
- Setting a smaller `length` truncates the array.

## Pitfall

```js
const xs = [1, 2, 3];
console.log(xs[xs.length]); // undefined — length is NOT a valid index
console.log(xs[xs.length - 1]); // 3 — last element
```

Also: `typeof [] === "object"`. Use `Array.isArray` when you need to check for an array (lesson `01.8.4`).

## Quick challenge

Create an array `week` with exactly three string day names. Print the first day, the last day (using `.length`), then replace the middle day and print the whole array. Finally set `week[3]` to a fourth day and print the new `.length`.
