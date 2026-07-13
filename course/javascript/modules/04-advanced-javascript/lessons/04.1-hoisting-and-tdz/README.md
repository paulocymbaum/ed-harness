# Hoisting and TDZ

> Graph index: `04.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript/04.1-hoisting-and-tdz:README.md -->

## Context

`var`, `let`, and `const` are all **hoisted** — the engine knows about the binding before execution reaches its line. But they differ in what happens when you read them *before* the declaration runs. `var` is initialized to `undefined` immediately. `let`/`const` stay uninitialized in the **Temporal Dead Zone (TDZ)** until their declaration line executes.

## Hoisting `var`

```js
console.log(typeof x); // "undefined"
var x = 5;
console.log(x); // 5
```

`var x` is hoisted to the top of its function/module scope and auto-initialized to `undefined`. Reading it early is legal — it just isn't assigned yet.

## The Temporal Dead Zone

```js
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;
```

```js
console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 20;
```

`let` and `const` are hoisted too, but they are **not initialized** until their declaration line runs. Any read between the start of the scope and that line throws — this dead zone is the TDZ.

## After the declaration line

```js
let a = 1;
console.log(a); // 1 — fine, the TDZ has ended

const b = 2;
console.log(b); // 2 — fine
```

Once execution passes the declaration, `let`/`const` behave exactly like any other variable.

## Predict first

What happens for each read?

```js
console.log(v1); // read var before its declaration
var v1 = 1;

console.log(v2); // read let before its declaration
let v2 = 2;

console.log(v3); // read const before its declaration
const v3 = 3;
```

## What to observe

- `var` read early → `undefined` (hoisted **and** auto-initialized).
- `let`/`const` read early → `ReferenceError` (hoisted but stuck in the TDZ).
- Any binding read **after** its declaration line runs normally — no error, no `undefined` surprise.
- The TDZ ends at the declaration line itself, not at the end of the enclosing block.
- Function declarations are hoisted *and* fully callable before their text position — a different rule from all three variable kinds.

## Mini-exercise

Predict, then verify:

```js
try {
  console.log(m);
  let m = 1;
} catch (e) {
  console.log(e.constructor.name); // ?
}

console.log(typeof n); // ? (read before "var n" runs)
var n = 1;
```
