# Stability Judge

## Problem context
Before composing multi-key sorts, you must know which algorithms are **stable**.

## Goal
Read an algorithm id and print `STABLE` or `UNSTABLE` for the typical textbook in-place/common form taught in this module. Unknown → `ERROR: unknown algorithm`.

## Lesson concepts practiced
- [ ] Stability preserves equal-key order.
- [ ] Merge / insertion / bubble (strict) → stable.
- [ ] Quick / heap / selection / shell → unstable.

## Functional requirements
- [ ] Support: `bubble`, `insertion`, `merge`, `quick`, `heap`, `selection`, `shell`.
- [ ] Print `STABLE`, `UNSTABLE`, or the error string.

## Non-functional requirements
- [ ] Exact labels
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `merge` → `STABLE`
- [ ] `quick` → `UNSTABLE`
- [ ] `insertion` → `STABLE`
- [ ] `heap` → `UNSTABLE`
- [ ] `bogosort` → `ERROR: unknown algorithm`

## Example data

Input:
- `merge`

Output:
- `STABLE`

## Suggested plan (no solution)
1. Map each id to STABLE/UNSTABLE from the lesson.
2. Lookup one trimmed stdin line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `counting` → `STABLE` (with stable placement).
