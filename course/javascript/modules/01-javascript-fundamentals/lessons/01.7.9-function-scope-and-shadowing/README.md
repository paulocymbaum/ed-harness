# Function Scope and Shadowing

> Graph index: `01.7.9`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.9-function-scope-and-shadowing:README.md -->

## Context

Parameters and `let`/`const` inside a function are **local** to that call. They do not leak outside. If a parameter or local uses the **same name** as an outer variable, the inner binding **shadows** the outer one while the function body runs — a common source of “why didn’t my global update?” bugs. Block scope from `01.2.1` still applies inside the body; this lesson focuses on the function boundary.

## Predict first

What prints?

```js
let label = "outer";

function show(label) {
  console.log(label);
}

show("inner");
console.log(label);
```

## Explanation

### Locals stay inside

```js
function addTax(price) {
  const rate = 0.1;
  return price * (1 + rate);
}

console.log(addTax(100));
// console.log(rate); // ReferenceError — rate is not visible here
// console.log(price); // ReferenceError
```

Each call gets its own `price` and `rate`.

### Shadowing hides the outer name

```js
let value = 10;

function bump(value) {
  value = value + 1;
  return value;
}

console.log(bump(value)); // 11 — uses the parameter
console.log(value);       // 10 — outer binding unchanged
```

Assigning to the parameter does **not** change the outer `value`. The names look the same; the bindings are different.

### Inner `let` also shadows

```js
let count = 0;

function next() {
  let count = 1;
  return count;
}

console.log(next());  // 1
console.log(count);   // 0
```

### Read outer when you do not shadow

```js
let unit = "kg";

function format(amount) {
  return amount + " " + unit; // unit comes from outside
}

console.log(format(5)); // 5 kg
```

If you need the outer binding, do not reuse its name for a parameter or local — or pass the value in explicitly.

## What to observe

- Parameters and locals are confined to the function call.
- Same name inside = shadowing; the outer binding is hidden for that scope.
- Assigning to a parameter or local does not rewrite the outer variable.
- Prefer different names when you mean to keep using the outer value.

## Quick challenge

Predict each line:

```js
let x = "module";

function probe(x) {
  const inner = x + "!";
  return inner;
}

console.log(probe("arg"));
console.log(x);
```
