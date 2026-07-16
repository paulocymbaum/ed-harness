# Object Destructuring

> Graph index: `02.1.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.1.3-object-destructuring:README.md -->

## Context

**Destructuring** unpacks properties into variables in one step. It keeps call sites readable when you only need a few fields from a larger object.

## Predict first

What prints?

```js
const user = { name: "Ada", age: 36, city: "London" };
const { name, city, role = "guest" } = user;
console.log(name, city, role);
```

## Explanation

Basic unpack:

```js
const user = { name: "Ada", age: 36 };
const { name, age } = user;
```

Rename while unpacking:

```js
const { name: fullName } = user;
// fullName === "Ada"
```

Defaults for missing keys:

```js
const { role = "guest" } = user;
// role === "guest"
```

Nested objects:

```js
const order = { id: 1, customer: { email: "a@b.com" } };
const { customer: { email } } = order;
```

## What to observe

- The left side mirrors the object shape.
- Defaults apply only when the value is `undefined` (missing key or explicit `undefined`).
- Renaming uses `source: localName`.

## Pitfall

```js
const user = null;
const { name } = user; // TypeError — cannot destructure null/undefined
```

Guard first, or use a fallback: `const { name } = user ?? {}`.

## Quick challenge

From `{ title: "Report", meta: { pages: 3 } }`, destructure so you get variables `title` and `pages` (nested) in one statement.
