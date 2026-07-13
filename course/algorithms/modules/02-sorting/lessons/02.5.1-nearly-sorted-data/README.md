<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.5.1-nearly-sorted-data:README.md -->

# Nearly Sorted Data

> Graph index: `02.5.1`

## Context

When the array is already almost sorted (few inversions, each element near its final index), **insertion sort** often beats general `O(n log n)` sorts because each insert is cheap. Hybrid library sorts switch to insertion on small / nearly ordered runs.

## Predict first

Is `[1, 2, 4, 3, 5]` a better fit for insertion or for a full merge sort in practice for tiny `n`?

## Explanation

Nearly sorted ⇒ insertion’s best-case behavior (~linear). Merge/heap still pay full `n log n`. Quicksort can stumble on some structured inputs depending on pivots. Measure with realistic data sizes; asymptotic labels hide constant factors on small `n`.

Rule of thumb: few swaps from sorted → prefer insertion (or TimSort-style run detection). Random chaos → efficient comparison / radix depending on keys.

## What to observe

- "Nearly sorted" is about inversions, not vibes.
- Small `n` changes the winner regardless of Big-O.
- Runtime sorts exploit this automatically in engines.

## Quick challenge

If every element is at most distance `k` from its sorted index, which approach often helps?
