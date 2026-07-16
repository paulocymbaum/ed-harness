# Object.assign and Merging

> Graph index: `02.2.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.2.3-object-assign-and-merging:README.md -->

## Context

Merging objects shows up in defaults, config, and state updates. `Object.assign` copies enumerable own properties onto a **target**. Object spread `{ ...a, ...b }` is the modern literal form of the same shallow merge idea.

## Predict first

What prints?

```js
const defaults = { theme: "light", lang: "en" };
const prefs = { lang: "pt" };
const merged = Object.assign({}, defaults, prefs);
console.log(merged, defaults);
```

## Explanation

Copy into a fresh target (safe merge):

```js
const defaults = { theme: "light", lang: "en" };
const prefs = { lang: "pt" };

const merged = Object.assign({}, defaults, prefs);
// { theme: "light", lang: "pt" }
```

Equivalent with spread:

```js
const merged2 = { ...defaults, ...prefs };
```

`Object.assign` **mutates** its first argument:

```js
const target = { a: 1 };
Object.assign(target, { b: 2 });
// target is now { a: 1, b: 2 }
```

Later sources win on key conflicts:

```js
Object.assign({}, { x: 1 }, { x: 2 }, { x: 3 }); // { x: 3 }
```

## What to observe

- Always pass `{}` as the target when you want a **new** object.
- Merge is **shallow**: nested objects are copied by reference, not cloned.
- Spread and `assign` both skip inherited keys the same way for plain sources.

## Pitfall

```js
const defaults = { nested: { a: 1 } };
const override = { nested: { b: 2 } };
const out = Object.assign({}, defaults, override);
console.log(out.nested); // { b: 2 } — whole nested object replaced, not deep-merged
```

Neither `assign` nor `{ ... }` is a deep merge. For nested data, you must merge levels intentionally (or use a dedicated deep-merge strategy later).

## Quick challenge

Write a one-liner that merges `{ host: "localhost", port: 3000 }` with `{ port: 8080, secure: true }` into a **new** object without mutating either source — once with `Object.assign`, once with spread.
