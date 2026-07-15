# Bucket Index Assigner

## Problem context
Bucket sort’s scatter step maps each key to a **bucket index** before sorting buckets.

## Goal
Read `x bucketCount` where `x` is a float in `[0,1]` and `bucketCount` is an integer `≥ 1`. Print `min(bucketCount-1, floor(x * bucketCount))`.

## Lesson concepts practiced
- [ ] Uniform `[0,1)` mapping uses `floor(x * buckets)`.
- [ ] Clamp the top endpoint so `x=1` stays valid.
- [ ] Indices must stay in range.

## Functional requirements
- [ ] One line: `x bucketCount`.
- [ ] Print a single integer index.

## Non-functional requirements
- [ ] Deterministic
- [ ] No sorting required

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `0.42 4` → `1`
- [ ] `0 4` → `0`
- [ ] `0.99 4` → `3`
- [ ] `1 4` → `3`

## Example data

Input:
- `0.42 4`

Output:
- `1`

## Suggested plan (no solution)
1. Parse float and count.
2. Compute floor product; clamp to `count-1`.
3. Print.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Map arbitrary `[min,max]` intervals into buckets.
