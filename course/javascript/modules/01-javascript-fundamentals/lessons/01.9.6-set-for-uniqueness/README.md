# Set for Uniqueness

> Graph index: `01.9.6`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.9.6-set-for-uniqueness:README.md -->

## Context

Arrays keep order and allow duplicates. A **`Set`** stores each value **at most once** and answers "have I seen this?" with `.has`. After `filter` / `map` pipelines (`01.9.3`–`01.9.5`), Set is the next tool for **unique lists** and **membership** when you start from array data.

This is a fundamentals introduction. Algorithm courses go deeper on `Map`/`Set` performance for search problems.

## Predict first

What does each line print?

```js
const s = new Set([1, 2, 2, 3]);
console.log(s.size);
console.log(s.has(2), s.has(9));

const tags = ["js", "node", "js", "cli"];
const unique = [];
for (const t of new Set(tags)) {
  unique[unique.length] = t;
}
console.log(unique);
```

## Explanation

### Create and inspect

```js
const seen = new Set();
seen.add("a");
seen.add("b");
seen.add("a"); // ignored — already present

console.log(seen.size); // 2
console.log(seen.has("a")); // true
console.log(seen.has("z")); // false
```

`.add` returns the set (chainable). Duplicates do not increase `.size`.

### From an array → unique array

Build a result list while asking the Set if the value is new:

```js
const nums = [3, 1, 3, 2, 1];
const seen = new Set();
const unique = [];

for (const n of nums) {
  if (!seen.has(n)) {
    seen.add(n);
    unique[unique.length] = n;
  }
}

console.log(unique); // [3, 1, 2]
```

`new Set(nums)` then walking the Set with `for...of` also yields uniques in first-seen order:

```js
const uniqueFromSet = [];
for (const n of new Set(nums)) {
  uniqueFromSet[uniqueFromSet.length] = n;
}
console.log(uniqueFromSet); // [3, 1, 2]
```

(You may later see `[...new Set(arr)]` — same idea via spread, taught with objects/arrays rest-spread.)

### Membership vs `includes`

```js
const ids = ["a", "b", "c"];
console.log(ids.includes("b")); // true — scans the array

const idSet = new Set(ids);
console.log(idSet.has("b")); // true — Set membership check
```

For small lists either works. Prefer Set when you will ask "is it here?" many times, or when uniqueness is the goal.

### Iterating a Set

`for...of` works on Sets (same skill as `01.9.2`):

```js
const letters = new Set(["x", "y", "x"]);
for (const ch of letters) {
  console.log(ch);
}
// x then y
```

### Combine with filter carefully

Sets are not arrays — they have no `.filter`. Collect into an array first, then filter:

```js
const uniques = [];
for (const n of new Set([1, 2, 2, 3, 4])) {
  uniques[uniques.length] = n;
}
const big = uniques.filter((n) => n > 2);
console.log(big); // [3, 4]
```

## What to observe

- `size` counts unique values; duplicates from the constructor input are collapsed.
- `.has` / `.add` / `.delete` are the core API for this lesson.
- Walking `new Set(arr)` with `for...of` yields each unique value in first-seen order.
- Object identity: two different `{ id: 1 }` objects are different Set entries (reference equality).

## Pitfall

```js
const s = new Set([NaN, NaN]);
console.log(s.size); // 1 — Set treats NaN as the same value
```

Also: `new Set("abba")` iterates **characters**, yielding a Set of `"a"` and `"b"`. Pass an array of strings when you mean whole strings.

## Quick challenge

Write a loop that prints the unique tags from `["b", "a", "b"]` in first-seen order (`b` then `a`) using `new Set` and `for...of` (no spread required).
