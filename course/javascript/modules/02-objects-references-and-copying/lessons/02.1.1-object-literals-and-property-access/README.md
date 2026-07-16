# Object Literals and Property Access

> Graph index: `02.1.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.1.1-object-literals-and-property-access:README.md -->

## Context

An **object literal** is the basic way to group related data as named properties. You create the object with `{ ... }`, then read and update fields with **dot** (`.`) or **bracket** (`[]`) notation.

## Predict first

What prints?

```js
const user = { name: "Ada", age: 36 };
user.age = 37;
console.log(user.name, user["age"], user.city);
```

## Explanation

Create an object and access properties:

```js
const user = {
  name: "Ada",
  age: 36,
};

console.log(user.name);    // "Ada"  — dot notation
console.log(user["age"]);  // 36     — bracket notation
```

Update and add properties:

```js
user.age = 37;
user.city = "London"; // new key
```

Missing keys return `undefined` (they do not throw):

```js
console.log(user.role); // undefined
```

## What to observe

- Dot notation needs a fixed identifier: `user.name`.
- Bracket notation needs a string (or expression): `user["name"]`.
- Reading a missing key is `undefined`, not an error.
- `const` on the variable does **not** freeze the object — you can still mutate properties.

## Pitfall

```js
const user = { name: "Ada" };
const key = "name";
console.log(user.key);  // undefined — looks for a property literally named "key"
console.log(user[key]); // "Ada" — uses the value of the variable
```

## Quick challenge

Given `const cfg = { host: "localhost", port: 3000 }`, write two lines: one that reads `port` with brackets, and one that adds `secure: true` with dots.
