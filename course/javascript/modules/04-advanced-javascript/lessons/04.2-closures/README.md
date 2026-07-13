# Closures

> Graph index: `04.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript/04.2-closures:README.md -->

## Context

A **closure** is a function bundled with references to the variables from the scope it was created in. Even after the outer function returns, the inner function keeps access to those variables — this is how you build private state without classes.

## A basic closure

```js
function makeGreeter(name) {
  return function () {
    return `Hello, ${name}!`;
  };
}

const greetAda = makeGreeter("Ada");
console.log(greetAda()); // "Hello, Ada!"
```

`makeGreeter` has already returned, but the inner function still "remembers" `name` — that reference is the closure.

## Private state via closure factory

```js
function createCounter(start) {
  let count = start;
  return {
    inc() { count += 1; },
    dec() { count -= 1; },
    get() { return count; },
  };
}

const counter = createCounter(10);
counter.inc();
counter.inc();
counter.dec();
console.log(counter.get()); // 11
```

`count` lives only inside `createCounter`'s scope. There is no way to read or set it except through `inc`, `dec`, and `get` — this is real encapsulation, no class needed.

## Each call creates a fresh closure

```js
const a = createCounter(0);
const b = createCounter(100);
a.inc();
console.log(a.get(), b.get()); // 1 100
```

`a` and `b` each capture their **own** `count` variable. Mutating one never affects the other.

## Predict first

What does each line print?

```js
const c = createCounter(5);
c.inc();
c.inc();
console.log(c.get());

const d = createCounter(5);
console.log(d.get());
```

## What to observe

- A closure captures **variables by reference**, not by value snapshot — `count` can change after the closure is created.
- Returning an object of functions from a factory is a common pattern for private state.
- Every call to the factory function creates a **new**, independent closure — no shared state between instances.
- The only way to touch `count` is through the methods the factory exposes — direct access is impossible from outside.

## Mini-exercise

Predict, then verify:

```js
function createToggle(initial) {
  let on = initial;
  return () => {
    on = !on;
    return on;
  };
}

const toggle = createToggle(false);
console.log(toggle()); // ?
console.log(toggle()); // ?
console.log(toggle()); // ?
```
