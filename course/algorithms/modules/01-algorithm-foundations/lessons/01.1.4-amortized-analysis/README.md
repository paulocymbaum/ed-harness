<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.1.4-amortized-analysis:README.md -->

# Amortized Analysis

> Graph index: `01.1.4`

## Context

Some operations are occasionally expensive but cheap most of the time. **Amortized** cost spreads rare expensive work across many cheap calls. Dynamic arrays (JavaScript’s `Array` growth) are the standard mental model.

## Predict first

If one `push` sometimes copies the whole array, is `push` “`O(n)`” forever after?

```js
const a = [];
for (let i = 0; i < 1_000_000; i++) a.push(i);
```

## Explanation

Engines grow backing storage in chunks (often doubling capacity). When capacity is full:

1. Allocate a larger buffer
2. Copy old elements
3. Then append

That single `push` can cost `O(n)`, but it happens rarely. Across a sequence of `n` pushes from empty:

- Most pushes: `O(1)`
- Occasional resize: `O(current size)`
- **Total** over `n` pushes: still `O(n)`
- **Amortized** per push: `O(1)`

```js
// Conceptual model (not the real V8 internals)
class DynArray {
  constructor() {
    this.data = new Array(1);
    this.len = 0;
  }
  push(x) {
    if (this.len === this.data.length) {
      const next = new Array(this.data.length * 2);
      for (let i = 0; i < this.len; i++) next[i] = this.data[i];
      this.data = next; // expensive, rare
    }
    this.data[this.len++] = x;
  }
}
```

Amortized analysis answers: “If I do this operation repeatedly as part of a larger algorithm, what is the **average cost per operation**?”

## What to observe

- Amortized `O(1)` ≠ every call is `O(1)` — spikes still exist (bad for hard real-time).
- Hash maps resizing (`Map` growth) has a similar story.
- Don’t confuse amortized with average-case over input distributions; here the “average” is over a **sequence of operations**.

## Quick challenge

Starting from capacity 1 and doubling on each resize, roughly how many element copies happen in total while pushing `n = 2^k` items? Why is that still linear in `n`?
