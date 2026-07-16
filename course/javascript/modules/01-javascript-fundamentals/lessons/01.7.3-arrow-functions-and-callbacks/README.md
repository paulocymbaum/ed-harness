# Arrow Functions and Callbacks

> Graph index: `01.7.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.3-arrow-functions-and-callbacks:README.md -->

## Context

Arrow functions are a short way to write a function and store it in a variable. Because a function is a value, you can pass it to another function as a **callback** — common with array helpers like `map` and `filter`, and in CLI scripts that transform lists of inputs.

## Predict first

What prints?

```js
const double = (n) => n * 2;
const nums = [1, 2, 3];
const result = nums.map(double);
console.log(result);
```

## Explanation

### Arrow function syntax

Same job as a declaration, shorter form:

```js
function double(n) {
  return n * 2;
}

const doubleArrow = (n) => n * 2;

console.log(double(4));
console.log(doubleArrow(4));
```

- One parameter: parentheses are optional — `n => n * 2`.
- Zero or 2+ parameters: parentheses are required — `() => 0`, `(a, b) => a + b`.

### Implicit return vs block body

Expression body returns automatically:

```js
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5
```

Block body needs an explicit `return`:

```js
const addBlock = (a, b) => {
  const sum = a + b;
  return sum;
};
console.log(addBlock(2, 3)); // 5
```

Forgetting `return` inside `{ ... }` yields `undefined`.

### Callbacks — functions as arguments

A callback is a function you pass so another function can call it later:

```js
function applyTwice(fn, value) {
  return fn(fn(value));
}

const inc = (n) => n + 1;
console.log(applyTwice(inc, 5)); // 7
```

Array methods take callbacks:

```js
const scores = [40, 70, 90];
const passing = scores.filter((s) => s >= 60);
const labeled = passing.map((s) => "Pass:" + s);
console.log(labeled); // ["Pass:70", "Pass:90"]
```

You can pass a named arrow or an inline arrow — both are callbacks.

### Not hoisted

Arrow functions assigned with `const` are not hoisted like `function` declarations. Declare them before you call them:

```js
// Works with declaration:
console.log(declared(1));
function declared(n) {
  return n;
}

// Fails if you call before the const line:
// console.log(arrow(1));
const arrow = (n) => n;
console.log(arrow(1));
```

## What to observe

- Arrow = function value; store it, pass it, return it.
- `(args) => expression` returns the expression; `(args) => { ... }` needs `return`.
- Callbacks are just functions passed as arguments — `map`/`filter` call yours once per item.
- Prefer arrows for short callbacks; use `function` when you want a named, hoisted declaration.

## Quick challenge

Predict each line:

```js
const clamp = (value, min, max) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const raw = [ -2, 5, 12 ];
console.log(raw.map((n) => clamp(n, 0, 10)));
```
