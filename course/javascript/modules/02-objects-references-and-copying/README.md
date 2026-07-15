# Objects
<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:02-objects-references-and-copying:README.md -->

This module is a **4-tier track** for working with JavaScript objects: create and read them, transform them with static methods, understand reference semantics, then serialize safely with JSON and reason about ownership.

Without these skills you’ll struggle with APIs, state updates, and “why did the original change?” bugs.

## Tier 1 — Creating and reading objects (`02.1`)

Learn literals, property access (`.` vs `[]`), computed keys / shorthand, and object destructuring before worrying about shared references.

**Planned leaves:** `02.1.1` Object Literals and Property Access · `02.1.2` Computed Keys and Shorthand · `02.1.3` Object Destructuring · `02.1.4` Rest and Spread for Objects and Arrays

### Beginner checklist
- [ ] I can create an object literal and read/update properties.
- [ ] I know when bracket notation is required.
- [ ] I can destructure fields with defaults and rest.

## Tier 2 — Object static methods (`02.2`)

Turn objects into lists of keys/values/entries, rebuild with `fromEntries`, and merge with `Object.assign` (and compare to `{ ... }`).

**Planned leaves:** `02.2.1` Object.keys values and entries · `02.2.2` Object.fromEntries · `02.2.3` Object.assign and Merging

### Intermediate checklist
- [ ] I can iterate own enumerable keys with `Object.keys` / `entries`.
- [ ] I can round-trip pairs with `Object.fromEntries`.
- [ ] I can merge defaults without inventing a deep-merge by accident.

## Tier 3 — References and copying (`02.3`)

Primitives behave like values; objects alias by reference. Shallow copy, nested traps, and `structuredClone` for deep snapshots.

**Lessons:** [`02.3.1` Reference vs Value](lessons/02.3.1-reference-vs-value/) · [`02.3.2` Shallow vs Deep Copy](lessons/02.3.2-shallow-vs-deep-copy/) · [`02.3.3` structuredClone](lessons/02.3.3-structuredclone/)

### Predict-first snippet
What prints?

```js
const a = { n: 10 };
const b = a;
b.n = 20;
console.log(a.n, b.n);
```

### Key terms
- **Mutation**: changing an existing object/array (`obj.x = ...`, `arr.push(...)`).
- **Alias**: two variables pointing to the same object.
- **Shallow copy**: new top-level container; nested objects still shared.

### References checklist
- [ ] I can tell if a value is primitive vs object.
- [ ] I can predict when two variables alias the same object.
- [ ] I know what shallow copy guarantees (and what it doesn’t).
- [ ] I know when to use `structuredClone` vs shallow copy.

## Tier 4 — JSON and ownership (`02.4`)

Serialize with `JSON.stringify` / `parse`, learn common pitfall cases (Date, `undefined`, cycles, BigInt), and distinguish own vs inherited properties with `Object.hasOwn`.

**Planned:** `02.4.1` JSON.stringify and parse · `02.4.2` Common JSON Cases and Pitfalls  
**Exists:** [`02.4.3` Object.hasOwn](lessons/02.4.3-object-hasown/)

### Predict-first snippet
What happens?

```js
const x = { when: new Date(), n: 1 };
const y = JSON.parse(JSON.stringify(x));
console.log(typeof y.when, y.when);
```

### Ownership checklist
- [ ] I can explain why JSON cloning is lossy vs `structuredClone`.
- [ ] I can use `Object.hasOwn` instead of `in` when I only want own keys.
- [ ] I can justify a copying/serialization strategy based on data shape.

## Common pitfalls (quick list)
- Thinking `const` prevents mutation.
- Using `Array.prototype.sort()` on a shared array (it mutates).
- Copying only the top-level object and then mutating nested fields.
- Using JSON cloning without realizing it changes types.
- Treating inherited prototype keys as “your” data (`in` vs `Object.hasOwn`).
