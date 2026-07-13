# Dynamic Programming

> Graph index: `05.5`

## Context

Dynamic Programming (DP) solves problems that have **overlapping subproblems** (the same smaller problem is solved over and over) and **optimal substructure** (the best answer is built from the best answers to smaller pieces). Instead of recomputing the same subproblem repeatedly — which blows up to exponential time — DP stores each subproblem's answer once and reuses it.

## The naive recursive version (exponential)

```js
// Classic "climbing stairs": 1 or 2 steps at a time, how many ways to reach step n?
function waysNaive(n) {
  if (n === 0) return 1; // one way: take no steps
  if (n < 0) return 0;
  return waysNaive(n - 1) + waysNaive(n - 2); // last step was 1, or last step was 2
}
```

`waysNaive(5)` recomputes `waysNaive(3)` multiple times through different call paths — the same subproblem is solved again and again.

## The DP version (linear)

```js
function waysDP(n) {
  if (n === 0) return 1;
  if (n === 1) return 1;
  const table = [1, 1]; // table[0] = ways(0), table[1] = ways(1)
  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2]; // reuse, don't recompute
  }
  return table[n];
}
```

## Predict first

Trace `waysDP(4)` by hand: what are `table[2]`, `table[3]`, and `table[4]`? Compare with calling `waysNaive(4)` — do they agree?

## What to observe

- `ways(n)` depends only on `ways(n-1)` and `ways(n-2)` — that's the **optimal substructure**: the answer for `n` is built directly from smaller answers.
- The naive version recomputes the same `n` many times across different branches of recursion — that's the **overlapping subproblems** DP exploits.
- The DP table fills **bottom-up**, from the smallest subproblem (`n=0`) up to the target — each cell is computed once and reused by later cells.
- `waysDP` runs in **O(n)** time and O(n) space; `waysNaive` runs in **O(2^n)** time — the difference is entirely about not re-solving the same subproblem.
- The recurrence itself (`table[i] = table[i-1] + table[i-2]`) is the same math as the naive recursion — DP changes *how* it's computed, not *what* is computed.

## Mini-exercise

Predict `waysDP(n)` for `n = 0, 1, 2, 3, 4, 5` by hand, filling the table left to right. Notice the sequence — where have you seen these numbers before?
