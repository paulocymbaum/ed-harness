<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/01-algorithm-foundations/01.3.3-measuring-with-console-time:README.md -->

# Measuring with console.time

> Graph index: `01.3.3`

## Context

Big-O predicts growth; `console.time` measures **this machine, this input, this run**. Use timing to check intuitions — and treat microbenchmarks with skepticism.

## Predict first

Will the second loop always look twice as slow?

```js
function work(n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += i;
  return s;
}

console.time("A");
work(1e7);
console.timeEnd("A");

console.time("B");
work(2e7);
console.timeEnd("B");
```

## Explanation

```js
console.time("label");
// ... code under test ...
console.timeEnd("label"); // prints elapsed ms
```

Good habits:

1. **Warm up** — run once before timing (JIT / caches).
2. **Large enough `n`** — tiny inputs drown in timer noise.
3. **Same environment** — battery, CPU boost, DevTools open all skew results.
4. **Compare ratios as `n` grows** — does doubling `n` roughly double time? That matches `O(n)`.

```js
function bench(label, fn, reps = 5) {
  // cheap warm-up
  fn();
  console.time(label);
  for (let i = 0; i < reps; i++) fn();
  console.timeEnd(label);
}

bench("linear", () => work(5e6));
```

For finer control in Node, `performance.now()` from `node:perf_hooks` avoids `console` formatting overhead.

## What to observe

- Micro-optimizations can vanish under JIT; prefer algorithmic wins (O(n²) → O(n log n)).
- Allocating inside a timed loop measures GC too — sometimes that’s fair, sometimes it isn’t.
- One run is an anecdote; a few reps with growing `n` is a story.

## Quick challenge

Time an `O(n)` scan vs an `O(n²)` nested loop for `n = 1e3`, `2e3`, `4e3`. Do the timings scale the way Big-O predicts?
