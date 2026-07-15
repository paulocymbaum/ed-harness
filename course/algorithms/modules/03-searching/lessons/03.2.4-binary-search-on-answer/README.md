# Binary Search on Answer

> Graph index: `03.2.4`

## Context

Sometimes the "array" you binary-search is the **numeric answer range** (capacity, distance, threshold), not indices into input. If feasibility is **monotonic** — once capacity `C` works, every `C' > C` also works — you can binary-search the minimum feasible answer.

## Predict first

Ship weights `[1,2,3,4,5,6,7,8,9,10]` within `D = 5` days. Is capacity `15` feasible? Is `14`?

Feasible means: greedily pack contiguous weights without exceeding capacity, using at most `D` days.

## Explanation

Template:

1. Choose `lo` / `hi` bounding possible answers (e.g. `max(weight)` … `sum(weights)`).
2. While `lo < hi`, test `mid`.
3. If `feasible(mid)` → `hi = mid` (try smaller).
4. Else `lo = mid + 1`.
5. Return `lo`.

The hard part is writing a correct `feasible` predicate — often a greedy simulation. Binary search only moves the answer; it does not invent monotonicity.

## What to observe

- Wrong predicates (non-monotonic) break the search — validate the "if mid works, larger works" claim.
- `lo` must be at least any hard lower bound (e.g. heaviest single item).
- This pattern powers "split array largest sum", "koko eating bananas", and similar prompts.

## Quick challenge

Flip the goal to the **maximum** infeasible value below success. How do the `lo`/`hi` updates change?
