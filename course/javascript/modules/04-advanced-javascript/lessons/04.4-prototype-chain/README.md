# Prototype Chain

> Graph index: `04.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript/04.4-prototype-chain:README.md -->

## Context

Every JavaScript object has an internal link to another object — its **prototype**. When you read a property that doesn't exist directly on an object, the engine walks up this prototype chain until it finds the property or reaches `null`. `Object.create(proto)` builds that link explicitly.

## Building a prototype link

```js
const parent = { greet() { return "hi"; } };
const child = Object.create(parent);

console.log(child.greet()); // "hi" — found on parent, not on child
console.log(Object.hasOwn(child, "greet")); // false
console.log("greet" in child); // true
```

`child` has no own `greet` property, but `greet` is reachable through the prototype chain — `in` reports `true` because it checks the whole chain, while `Object.hasOwn` only checks the object itself.

## Adding own properties

```js
Object.assign(child, { name: "Ada" });

console.log(Object.hasOwn(child, "name")); // true — own property
console.log(Object.hasOwn(child, "greet")); // false — still inherited
console.log("nickname" in child); // false — not on child or parent
```

`Object.assign` copies properties directly onto `child`, making them **own** properties — distinct from properties reachable only through the prototype.

## Three outcomes for any key

```js
function describeKey(obj, key) {
  if (Object.hasOwn(obj, key)) return "own";
  if (key in obj) return "inherited";
  return "missing";
}
```

Every key you check against an object falls into exactly one of three buckets: **own** (found directly on the object), **inherited** (found somewhere up the prototype chain), or **missing** (not found anywhere).

## Predict first

Given `const child = Object.create({ a: 1 }); Object.assign(child, { b: 2 });`, what does each check report?

```js
console.log(Object.hasOwn(child, "a")); // ?
console.log(Object.hasOwn(child, "b")); // ?
console.log("a" in child);              // ?
console.log("c" in child);              // ?
```

## What to observe

- `Object.hasOwn(obj, key)` only reports `true` for properties defined **directly** on `obj`, never inherited ones.
- `key in obj` checks the **entire prototype chain**, so it reports `true` for both own and inherited properties.
- `Object.assign(target, source)` copies properties as **own** properties onto `target`.
- `Object.create(proto)` creates a new object whose prototype is exactly `proto` — no properties are copied, only linked.
- A key that is neither own nor found via `in` is simply absent from the whole chain.

## Mini-exercise

Predict, then verify:

```js
const base = { role: "admin" };
const user = Object.create(base);
Object.assign(user, { name: "Grace" });

console.log(Object.hasOwn(user, "role")); // ?
console.log("role" in user);              // ?
console.log(Object.hasOwn(user, "email")); // ?
console.log("email" in user);              // ?
```
