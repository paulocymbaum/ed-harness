# Computed Keys and Shorthand

> Graph index: `02.1.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.1.2-computed-keys-and-shorthand:README.md -->

## Context

When building objects, two shortcuts show up constantly: **property shorthand** (reuse a variable name as the key) and **computed keys** (decide the key name from an expression).

## Predict first

What prints?

```js
const name = "Ada";
const field = "role";
const user = { name, [field]: "admin" };
console.log(user);
```

## Explanation

**Shorthand** — if the variable name matches the property name:

```js
const name = "Ada";
const age = 36;

const user = { name, age };
// same as { name: name, age: age }
```

**Computed keys** — put an expression inside `[...]` in the literal:

```js
const field = "role";
const user = {
  name: "Ada",
  [field]: "admin",     // key becomes "role"
  ["is" + "Active"]: true,
};
```

You can combine both:

```js
const id = 7;
const prefix = "user";
const record = {
  id,
  [`${prefix}Id`]: id,
};
// { id: 7, userId: 7 }
```

## What to observe

- Shorthand is only for when the *variable name* is the key you want.
- Computed keys are evaluated at object-creation time.
- Bracket access (`obj[expr]`) and computed keys in literals (`{ [expr]: value }`) use the same idea: the key is an expression.

## Pitfall

```js
const key = "name";
const obj = { key: "Ada" }; // property named "key", not "name"
console.log(obj.name); // undefined
```

Use `{ [key]: "Ada" }` when the key must come from a variable.

## Quick challenge

Build an object from `const kind = "error"` and `const message = "not found"` so the result is `{ type: "error", message: "not found" }` using shorthand and a computed key for `type`.
