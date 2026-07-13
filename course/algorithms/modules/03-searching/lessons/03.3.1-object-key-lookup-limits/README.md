# Object Key Lookup Limits

> Graph index: `03.3.1`

## Context

Plain objects are tempting as "maps", but keys are coerced to **strings** (except symbols). That breaks numeric distinctions, object-identity keys, and some `undefined` patterns. Knowing the limits tells you when to switch to `Map`.

## Predict first

```js
const o = {};
o[1] = "a";
o["1"] = "b";
console.log(o[1], Object.keys(o));
```

What prints? How many keys?

## Explanation

`o[1]` and `o["1"]` share the same property. Objects also stringify other keys awkwardly:

```js
const k = {};
const o = {};
o[k] = 1;
o[{}] = 2; // both become "[object Object]"
```

Lookup remains amortized fast for string keys, but **semantics** are wrong for many search problems (coords, pairs, object ids). Next lessons introduce `Map`/`Set` with proper key identity.

## What to observe

- `Object.keys` order and string coercion are separate from algorithmic Big-O.
- Using objects for frequency of numbers often "works" by accident via `"3"` keys — until you mix types.
- Never use objects when keys must be objects or preserve number vs string.

## Quick challenge

Predict `({ [true]: 1 })["true"]` and `({ [true]: 1 })[true]`. Same slot?
