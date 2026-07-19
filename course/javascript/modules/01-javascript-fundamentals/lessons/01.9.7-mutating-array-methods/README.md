# Mutating Array Methods

> Graph index: `01.9.7`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.7-mutating-array-methods:README.md -->

## Context

So far most transforms (`filter`, `map`, Set copies) produced **new** collections. **Mutating** methods change the **same** array object in place — useful for stacks, queues, and in-place edits, dangerous when another variable still points at that array.

## Predict first

What does each line print?

```js
const xs = [1, 2, 3];
xs.push(4);
console.log(xs);

const last = xs.pop();
console.log(last, xs);

const ys = ["b", "c"];
ys.unshift("a");
console.log(ys);
console.log(ys.shift());
console.log(ys);
```

## Explanation

### Ends of the list: `push` / `pop`

```js
const stack = [];
stack.push("a");
stack.push("b");
console.log(stack.pop()); // "b"
console.log(stack); // ["a"]
```

`push` appends and returns the new length. `pop` removes the last element and returns it (`undefined` if empty).

### Front of the list: `unshift` / `shift`

```js
const q = ["b"];
q.unshift("a"); // ["a", "b"]
console.log(q.shift()); // "a"
console.log(q); // ["b"]
```

These rewrite indexes of every later element — fine for small arrays; prefer `push`/`pop` when you only need one end.

### `splice` — remove / insert in the middle

```js
const letters = ["a", "b", "c", "d"];
const removed = letters.splice(1, 2, "X"); // start, deleteCount, ...insert
console.log(removed); // ["b", "c"]
console.log(letters); // ["a", "X", "d"]
```

### `sort` and `reverse` mutate

```js
const nums = [3, 1, 2];
nums.sort((a, b) => a - b);
console.log(nums); // [1, 2, 3]

nums.reverse();
console.log(nums); // [3, 2, 1]
```

Default `sort` without a comparator converts values to strings — numeric sorts need a compare function. Deeper sort contracts appear in Algorithms; here remember: **these change the array**.

### Shared references

```js
const a = [1, 2];
const b = a;
b.push(3);
console.log(a); // [1, 2, 3] — same array
```

If you need an independent list before mutating, copy first (later: `slice` in `01.9.8`, or spread).

## What to observe

- Mutating methods change `arr` itself; always mentally track who else holds that reference.
- `push`/`pop` ↔ end; `unshift`/`shift` ↔ front.
- `splice` can delete and/or insert at an index.
- `sort` / `reverse` return the same array object (chainable) after mutating it.

## Pitfall

```js
const xs = [3, 2, 10];
xs.sort();
console.log(xs); // [10, 2, 3] — lexicographic string order, not numeric
```

## Quick challenge

Start with `const days = ["Tue", "Wed"]`. Use mutating methods only: `unshift` Monday, `push` Thursday, `splice` to replace `"Wed"` with `"WedX"`, then print the array.
