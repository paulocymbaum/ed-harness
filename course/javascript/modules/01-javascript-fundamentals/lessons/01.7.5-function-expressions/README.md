# Function Expressions

> Graph index: `01.7.5`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.5-function-expressions:README.md -->

## Context

A **function expression** creates a function as a value and stores it in a variable. Same job as a declaration (`01.7.1`), different shape: the name lives on the binding (`const`), not on `function name`. You call it only after that line runs. Arrows (`01.7.3`) are a short form of expression; this lesson focuses on the classic `function` expression.

## Predict first

What prints?

```js
const double = function (n) {
  return n * 2;
};

console.log(double(5));
console.log(typeof double);
```

## Explanation

### Expression vs declaration

```js
function declareGreet(name) {
  return "Hi, " + name;
}

const expressGreet = function (name) {
  return "Hi, " + name;
};

console.log(declareGreet("Ana"));
console.log(expressGreet("Bob"));
```

Both are callable the same way. The expression version is a value assigned with `const` (or `let`).

### Not hoisted like declarations

Declarations can be called above their line in the file. Expressions assigned with `const` cannot:

```js
console.log(declared(1)); // works
function declared(n) {
  return n;
}

// console.log(expressed(1)); // ReferenceError — cannot use before init
const expressed = function (n) {
  return n;
};
console.log(expressed(1));
```

Declare the binding before you call it.

### Functions as values

Because the expression is a value, you can pass it, return it, or hold it in a variable — the same idea callbacks use in `01.7.3`.

```js
function apply(fn, value) {
  return fn(value);
}

const triple = function (n) {
  return n * 3;
};

console.log(apply(triple, 4)); // 12
```

## What to observe

- `const f = function (…) { … }` stores a function value in `f`.
- Call with `f(args)` only after the assignment line has run.
- Expressions are not hoisted like `function name() {}` declarations.
- Prefer a named declaration when you want top-of-file helpers; prefer an expression when the function is a value you store or pass.

## Quick challenge

Predict each line:

```js
const clamp = function (value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

console.log(clamp(5, 0, 10));
console.log(clamp(-1, 0, 10));
console.log(typeof clamp);
```
