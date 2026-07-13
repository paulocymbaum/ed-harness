<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.3.4-proving-termination:README.md -->

# Proving Termination

> Graph index: `01.3.4`

## Context

A loop that never finishes is wrong even if the invariant looks elegant. **Termination** means every path eventually hits the exit condition. You prove it by naming a quantity that **shrinks** (or otherwise progresses) each iteration and is bounded below.

## Predict first

Does this always halt?

```js
function shrink(n) {
  while (n !== 1) {
    if (n % 2 === 0) n = n / 2;
    else n = 3 * n + 1; // Collatz — believed to halt; not a proof you should rely on in code reviews
  }
  return n;
}
```

## Explanation

A simple termination argument for binary search:

```js
function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

**Progress measure:** the integer window size `hi - lo + 1`.

- Each branch sets `lo = mid + 1` or `hi = mid - 1`, so the window **strictly shrinks**.
- Window size is a non-negative integer.
- Therefore the loop cannot run forever.

Bad pattern — no guaranteed shrink:

```js
let i = 0;
while (i < arr.length) {
  if (rareCondition) continue; // i never moves
  i++;
}
```

Checklist before shipping a loop:

1. What quantity decreases (or finite state advances)?
2. Is it bounded (can’t decrease forever)?
3. Do **all** branches make progress — including `continue` paths?

## What to observe

- Floating-point “shrink” (`x /= 2`) can misbehave near zero; prefer integer measures when possible.
- Recursion terminates when arguments move toward the base case on **every** recursive call.
- Infinite loops in event-driven JS often come from re-queueing work without a done condition — same idea.

## Quick challenge

For two-pointer reverse (`lo++`, `hi--` while `lo < hi`), name the progress measure and argue it terminates for every finite array.
