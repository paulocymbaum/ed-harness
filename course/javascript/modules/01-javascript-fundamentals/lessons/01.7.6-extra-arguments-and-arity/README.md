# Extra Arguments and Arity

> Graph index: `01.7.6`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.6-extra-arguments-and-arity:README.md -->

## Context

**Arity** is how many parameters a function declares. In `01.7.2` you saw that **missing** arguments become `undefined`. The other side: **extra** arguments are simply ignored — JavaScript does not throw. Helpers and CLI wrappers often pass more tokens than a helper uses; knowing which ones bind matters.

## Predict first

What prints?

```js
function pair(a, b) {
  return a + "," + b;
}

console.log(pair("x", "y"));
console.log(pair("x", "y", "z", "w"));
console.log(pair("x"));
```

## Explanation

### Parameters bind left to right

Arguments map to parameters in order. Anything past the last parameter name is discarded for that call.

```js
function label(prefix, value) {
  return prefix + ":" + value;
}

console.log(label("score", 90));           // score:90
console.log(label("score", 90, "ignored")); // score:90 — third arg unused
```

### Missing vs extra (full picture)

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));       // 5
console.log(add(2));          // NaN — b is undefined
console.log(add(2, 3, 99));   // 5 — 99 ignored
```

Document the expected count. Validate when fewer are unsafe; ignore extras or gather them later with rest (`01.7.8`).

### length is the declared arity

Functions expose how many parameters they declare:

```js
function clamp(value, min, max) {
  return value;
}

console.log(clamp.length); // 3
```

That is the design of the API, not a guarantee callers pass exactly three.

## What to observe

- Extra arguments do **not** cause an error — they are ignored by named parameters.
- Missing arguments are `undefined` (see `01.7.2`).
- Match arguments to parameters left to right.
- `fn.length` reports declared parameter count (arity), not how many were passed this call.

## Quick challenge

Predict each line:

```js
function firstTwo(a, b) {
  return [a, b];
}

console.log(firstTwo(1, 2, 3, 4));
console.log(firstTwo(1));
console.log(firstTwo.length);
```
