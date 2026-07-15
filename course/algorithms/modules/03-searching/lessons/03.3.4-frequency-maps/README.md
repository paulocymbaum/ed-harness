# Frequency Maps

> Graph index: `03.3.4`

## Context

A frequency map records **how many times** each key appears. Anagrams, majority elements, and "top-k frequent" all start from `count[x]++` in one scan.

## Predict first

```js
const arr = ["a", "b", "a", "a"];
// After counting: a→3, b→1
```

What does a query for `"c"` return if missing means `0`?

## Explanation

```js
const freq = new Map();
for (const x of arr) {
  freq.set(x, (freq.get(x) ?? 0) + 1);
}
```

Prefer `Map` when keys are not safe object property names. Plain objects work for string tokens if you initialize carefully (`Object.create(null)` avoids prototype keys).

Frequency tables turn later questions into `O(1)` reads: "does any count equal `n`?", "subtract for sliding windows", "compare two histograms".

## What to observe

- Missing key → treat as `0`, not `undefined`, for arithmetic.
- Building is `O(n)`; do not nest recount loops per query.
- Decrement carefully in sliding-window frequency problems (next modules use this heavily).

## Quick challenge

Given two strings, decide anagram using frequency maps. What must be true of the two maps?
