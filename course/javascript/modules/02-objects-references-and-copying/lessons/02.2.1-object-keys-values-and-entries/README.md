# Object.keys values and entries

> Graph index: `02.2.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/02-objects-references-and-copying/02.2.1-object-keys-values-and-entries:README.md -->

## Context

Objects are not arrays, but you often need a list of keys, values, or `[key, value]` pairs. `Object.keys`, `Object.values`, and `Object.entries` turn an object into something you can map, filter, or loop over.

## Predict first

What prints?

```js
const user = { name: "Ada", age: 36 };
console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.entries(user));
```

## Explanation

```js
const user = { name: "Ada", age: 36 };

Object.keys(user);    // ["name", "age"]
Object.values(user);  // ["Ada", 36]
Object.entries(user); // [["name", "Ada"], ["age", 36]]
```

Typical loop with entries:

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

Transform values into a new object (pair with `fromEntries` in the next lesson):

```js
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2 }).map(([k, v]) => [k, v * 2]),
);
// { a: 2, b: 4 }
```

## What to observe

- These methods return **own enumerable** string keys (not prototype chain, not Symbols).
- Key order for ordinary string keys follows creation order for typical object literals.
- The result is a **new array**; mutating it does not change the object.

## Pitfall

```js
const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = 1;

console.log(Object.keys(obj)); // ["own"] — inherited keys are skipped
console.log("inherited" in obj); // true
```

`in` walks the prototype; `Object.keys` does not.

## Quick challenge

Given `{ a: 1, b: 2, c: 3 }`, use `Object.entries` + `filter` to keep only pairs whose value is greater than 1, then list the remaining keys.
