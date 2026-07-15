# Amortized Push Counter

## Problem context
Dynamic array growth copies on resize. Rare `O(n)` spikes still leave **amortized** `O(1)` per push.

## Goal
Read a power-of-two `n` (`n = 2^k`, `k >= 1`). Starting from capacity 1 and doubling on each resize, print total element copies while pushing `n` items, and the amortized class.

## Lesson concepts practiced
- [ ] Amortized `O(1)` ≠ every call is `O(1)` — spikes still exist.
- [ ] Total over `n` pushes is still `O(n)` → amortized per push `O(1)`.
- [ ] Amortized “average” is over a **sequence of operations**, not an input distribution.

## Functional requirements
- [ ] When capacity is full, copy `current length` elements into a double-sized buffer, then append.
- [ ] Output: `copies=<total> amortized=O(1)`
- [ ] If `n` is not a positive power of two, print `ERROR: need power of two`

## Non-functional requirements
- [ ] Correct for small powers of two
- [ ] No real multi-million pushes required

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `8` → `copies=7 amortized=O(1)`
- [ ] Input `4` → `copies=3 amortized=O(1)`
- [ ] Input `2` → `copies=1 amortized=O(1)`
- [ ] Input `3` → `ERROR: need power of two`

## Example data

Input:
- `8`

Output:
- `copies=7 amortized=O(1)`

## Suggested plan (no solution)
1. Validate `n` is `2^k`.
2. Walk capacity doubling when full; accumulate copy counts.
3. Print `copies=… amortized=O(1)`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also print resize count.
