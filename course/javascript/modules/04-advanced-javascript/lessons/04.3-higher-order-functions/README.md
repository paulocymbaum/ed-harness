# Higher-Order Functions

> Graph index: `04.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript/04.3-higher-order-functions:README.md -->

## Context

A **higher-order function** either takes a function as an argument, returns a function, or both. `Array.prototype.map`, `filter`, and `reduce` are the most common examples — they let you describe *what* transformation to apply without writing the loop yourself.

## `map`: transform every element

```js
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);
console.log(doubled); // [2, 4, 6]
```

`map` calls the callback once per element and collects the return values into a **new array** of the same length. The original array is untouched.

## `filter`: keep some elements

```js
const words = ["", "hi", "", "bye"];
const nonEmpty = words.filter((w) => w.length > 0);
console.log(nonEmpty); // ["hi", "bye"]
```

`filter` calls the callback once per element and keeps only the elements where the callback returned a truthy value. The result can be shorter than the input.

## Functions as arguments and return values

```js
function pipeline(...steps) {
  return (input) => steps.reduce((value, step) => step(value), input);
}

const shout = pipeline(
  (s) => s.trim(),
  (s) => s.toUpperCase(),
);

console.log(shout("  hello  ")); // "HELLO"
```

`pipeline` is higher-order twice over: it takes functions as arguments (`steps`) and returns a new function. Each step runs in order, feeding its output to the next.

## Predict first

What does each line print?

```js
console.log([1, 2, 3].map((n) => n * 2));
console.log(["a", "", "b", ""].filter((s) => s !== ""));
console.log([1, 2, 3].map(String));
```

## What to observe

- `map` always returns a **new array with the same length** as the input — one output per input element.
- `filter` returns a **new array that may be shorter** — only elements passing the predicate survive.
- Neither `map` nor `filter` mutates the original array.
- A function can be passed by name (`map(String)`) instead of wrapped in an arrow function, as long as its signature matches.
- Composing small functions (a "pipeline") is a common higher-order pattern for building larger transformations.

## Mini-exercise

Predict, then verify:

```js
const lines = ["Hello", "", "World", ""];

console.log(lines.map((l) => l.toUpperCase()));
console.log(lines.filter((l) => l.length > 0));
console.log(lines.filter((l) => l.length > 0).map((l) => l.toUpperCase()));
```
