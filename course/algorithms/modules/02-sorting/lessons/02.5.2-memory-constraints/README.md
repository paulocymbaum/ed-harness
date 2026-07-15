<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.5.2-memory-constraints:README.md -->

# Memory Constraints

> Graph index: `02.5.2`

## Context

Sorts trade **extra memory** for speed or simplicity. Merge sort wants `Θ(n)` buffers. Heap sort keeps `O(1)` array extras with `O(n log n)` time. In-place quicksort uses stack frames. Under tight RAM, auxiliary buffers can be the blocker, not CPU.

## Predict first

If you may not allocate a second `n`-sized array, which guaranteed `n log n` sort from this module fits better — merge or heap?

## Explanation

| Need | Lean toward |
|------|-------------|
| Stable + plenty RAM | Merge |
| Guaranteed `n log n` + tight RAM | Heap |
| Average speed, OK worst-case risk | Tuned quicksort |
| Tiny nearly-sorted | Insertion |

Also watch recursion depth vs explicit stacks. External / online sorting appears when data exceeds RAM entirely (next lesson touches online vs offline).

## What to observe

- "In-place" claims vary — ask what `O(1)` means for your language.
- Buffers can dwarf the CPU gain if memory is scarce.
- JS arrays hide allocation costs in engines; still reason about asymptotic extras.

## Quick challenge

Why might merge sort fail a coding environment with a hard memory ceiling even if time limits are fine?
