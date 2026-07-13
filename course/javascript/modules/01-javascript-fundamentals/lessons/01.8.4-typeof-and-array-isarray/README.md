# typeof and Array.isArray

> Graph index: `01.8.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.8.4-typeof-and-array-isarray:README.md -->

## Context

`typeof` reports a value's type as a **string**. It is useful for primitives — and misleading for arrays and `null`. Prefer `Array.isArray` when you need to know if something is an array.

## What `typeof` returns

```js
typeof 42;          // "number"
typeof "hi";        // "string"
typeof true;        // "boolean"
typeof undefined;   // "undefined"
typeof function () {}; // "function"
typeof Symbol();    // "symbol"
typeof 1n;          // "bigint"
```

Objects (including arrays and `null`) mostly report `"object"`:

```js
typeof {};          // "object"
typeof [];          // "object"
typeof null;        // "object"  ← famous quirk
```

## Why `Array.isArray` exists

```js
const xs = [1, 2, 3];
console.log(typeof xs);           // "object"
console.log(Array.isArray(xs));   // true
console.log(Array.isArray({}));   // false
console.log(Array.isArray(null)); // false
```

Use **`Array.isArray(x)`** when the question is “is this an array?” — not `typeof x === "object"`.

## Safe type checks (common pattern)

```js
function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

console.log(describe(null));   // "null"
console.log(describe([]));     // "array"
console.log(describe({}));     // "object"
console.log(describe(7));      // "number"
```

Check `null` first, then arrays, then fall back to `typeof`.

## Predict first

What does each line print?

```js
console.log(typeof null);
console.log(typeof []);
console.log(Array.isArray([]));
console.log(Array.isArray({ length: 2 }));
console.log(typeof Number);
```

## What to observe

- `typeof` always returns a string tag (`"number"`, `"object"`, …).
- `typeof null === "object"` is a long-standing language quirk — never treat it as “null is an object” in app logic.
- Arrays are objects under `typeof`; discriminate them with `Array.isArray`.
- Array-like objects (`{ length: 2 }`) are **not** arrays.
- Functions are `"function"` under `typeof` (a special case among callable objects).

## Mini-exercise

Predict, then verify:

```js
console.log(typeof NaN);
console.log(Array.isArray("[]"));
console.log(typeof []);
console.log(describe(undefined)); // using the helper above
```
