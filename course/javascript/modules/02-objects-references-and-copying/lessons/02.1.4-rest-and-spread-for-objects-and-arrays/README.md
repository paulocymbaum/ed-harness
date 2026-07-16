# Rest and Spread for Objects and Arrays

> Graph index: `02.1.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.1.4-rest-and-spread-for-objects-and-arrays:README.md -->

## Context

**Spread** (`...`) copies enumerable own properties into a new object/array. **Rest** gathers the “leftover” keys or elements into a new object/array. Same syntax, different job depending on position.

## Predict first

What prints?

```js
const base = { a: 1, b: 2, c: 3 };
const { a, ...rest } = base;
const copy = { ...base, b: 99 };
console.log(a, rest, copy);
```

## Explanation

**Object spread** — shallow copy / override:

```js
const defaults = { theme: "light", lang: "en" };
const prefs = { ...defaults, lang: "pt" };
// { theme: "light", lang: "pt" }
```

**Object rest** — keep what you did not pull out:

```js
const user = { id: 1, name: "Ada", role: "admin" };
const { id, ...publicFields } = user;
// publicFields => { name: "Ada", role: "admin" }
```

**Array spread / rest** work the same idea:

```js
const nums = [1, 2, 3];
const more = [...nums, 4];      // [1, 2, 3, 4]
const [first, ...tail] = nums;  // first=1, tail=[2, 3]
```

## What to observe

- Object spread is **shallow**: nested objects are still shared references.
- Later keys win when spreading multiple sources: `{ ...a, ...b }`.
- Rest in destructuring must be the **last** property/element.

## Pitfall

```js
const state = { user: { name: "Ada" } };
const next = { ...state };
next.user.name = "Grace";
console.log(state.user.name); // "Grace" — nested object was shared
```

Spread copied the top level only. Nested cloning comes later in this module.

## Quick challenge

From `{ id: 10, name: "Ada", active: true }`, produce `{ name: "Ada", active: true }` using rest (drop `id` without listing every other key by hand).
