<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.2.3-recursion-vs-iteration:README.md -->

# Recursion vs Iteration

> Graph index: `01.2.3`

## Context

The same process can be written as a loop or as recursive calls. Recursion often matches the problem’s structure (trees, divide-and-conquer). Iteration usually uses less stack and is safer for deep inputs in JavaScript.

## Predict first

What happens for large `n`?

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

factorial(100_000);
```

## Explanation

**Recursion** stores unfinished work on the call stack. Each frame holds locals and a return address. Deep recursion → `RangeError: Maximum call stack size exceeded`.

**Iteration** keeps state in explicit variables:

```js
function factorialIter(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
```

When recursion shines:

```js
function walk(node, visit) {
  if (!node) return;
  visit(node);
  walk(node.left, visit);
  walk(node.right, visit);
}
```

A tree walk is naturally recursive; an iterative version needs an explicit stack — same space idea, different place.

| Prefer recursion when… | Prefer iteration when… |
|------------------------|-------------------------|
| Structure is hierarchical | Depth can be huge (`n` ~ 10⁵+) |
| Code clarity wins | You need guaranteed stack safety |
| Depth is O(log n) (balanced splits) | Hot path / tight loops |

## What to observe

- JS engines do **not** reliably optimize tail calls — write iterative code if depth is linear in `n`.
- “Recursive” algorithms can still be implemented with an explicit `stack = []`.
- Convert between forms by identifying the **state** each stack frame holds.

## Quick challenge

Rewrite a recursive sum of a linked-list-like `{ value, next }` structure as a `while` loop. Compare auxiliary space.
