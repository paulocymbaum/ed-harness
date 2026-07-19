# Rest Parameters

> Graph index: `01.7.8`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.8-rest-parameters:README.md -->

## Context

Named parameters bind a fixed count; extras are ignored (`01.7.6`). A **rest parameter** (`...name`) gathers every leftover argument into a real **array** so helpers can accept “any number of values” — sums, joins, or variadic labels. Rest for objects/arrays in literals is taught later in `02.1.4`; here the focus is **function parameters**.

## Predict first

What prints?

```js
function sum(...nums) {
  let total = 0;
  for (const n of nums) {
    total += n;
  }
  return total;
}

console.log(sum(1, 2, 3));
console.log(sum(10));
console.log(sum());
```

## Explanation

### Rest gathers leftovers into an array

```js
function joinLabels(prefix, ...parts) {
  return prefix + ":" + parts.join("-");
}

console.log(joinLabels("id", "a", "b", "c")); // id:a-b-c
console.log(joinLabels("id"));                // id:
```

`prefix` takes the first argument; `parts` is an array of whatever remains.

### Rest must be last

```js
// Valid
function ok(a, b, ...rest) {
  return rest;
}

// Invalid syntax — rest cannot come before other parameters
// function bad(...rest, last) { }
```

### Empty rest is `[]`

When there are no leftover arguments, rest is an empty array — not `undefined`.

```js
function tail(...items) {
  return items;
}

console.log(tail());       // []
console.log(tail(1, 2));   // [1, 2]
```

### Rest vs ignored extras

Without rest, extras disappear. With rest, you keep them for processing.

```js
function firstOnly(a) {
  return a;
}

function firstAndRest(a, ...rest) {
  return { a, rest };
}

console.log(firstOnly(1, 2, 3));           // 1
console.log(firstAndRest(1, 2, 3));        // { a: 1, rest: [2, 3] }
```

## What to observe

- `...name` in the parameter list collects remaining args into an array.
- Rest must be the **last** parameter.
- Zero leftovers → `[]`.
- Use rest for variadic helpers; use fixed params when the arity is fixed.

## Quick challenge

Predict each line:

```js
function maxOf(...nums) {
  if (nums.length === 0) return null;
  let m = nums[0];
  for (const n of nums) {
    if (n > m) m = n;
  }
  return m;
}

console.log(maxOf(3, 9, 1));
console.log(maxOf(5));
console.log(maxOf());
```
