<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.4.4-sorting-objects-by-keys:README.md -->

# Sorting Objects by Keys

> Graph index: `02.4.4`

## Context

Real data is objects. You sort with a comparator on one or more **properties** (`age`, `name`, …). Remember: `sort` mutates the array of references; nested objects are not copied.

## Predict first

`[{n:'b',a:2},{n:'a',a:2}]` sorted by `a` ascending then stably by `n` — who comes first?

## Explanation

```js
users.sort((u, v) => u.age - v.age);
users.sort((u, v) => u.name.localeCompare(v.name)); // needs prior stability!
// Better single pass:
users.sort((u, v) => u.age - v.age || u.name.localeCompare(v.name));
```

Compare numbers with subtraction (watch overflow) or `<`/`>` returning -1/1. Compare strings with `localeCompare` when locale rules matter. Missing keys yield `undefined` — decide an explicit policy.

## What to observe

- Property access lives inside the comparator.
- Combined keys with `||` short-circuit on `0`.
- Mutation still applies to the array of object refs.

## Quick challenge

Why is a single multi-key comparator safer than two unstable sorts?
