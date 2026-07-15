# Growth Ratio Classifier

## Problem context
`console.time` is not Big-O, but ratios as `n` grows help check intuitions (doubling `n` ≈ doubling time for `O(n)`).

## Goal
Read `<class> <ratio>` where `ratio` is observed `time(2n) / time(n)`. Print whether the ratio **matches** the class expectation.

## Lesson concepts practiced
- [ ] Timing measures this machine / input / run — treat microbenchmarks carefully.
- [ ] Compare ratios as `n` grows to check growth stories.
- [ ] Doubling `n` roughly doubling time matches `O(n)`; `O(n²)` expects roughly 4×.

## Functional requirements
- [ ] Classes: `linear` expects ratio in `[1.5, 2.5]` → `MATCH`, else `MISMATCH`
- [ ] `quadratic` expects ratio in `[3.0, 5.0]` → `MATCH`, else `MISMATCH`
- [ ] Unknown class → `ERROR: unknown class`
- [ ] Malformed input → `ERROR: bad input`

## Non-functional requirements
- [ ] Do not run real timers — classify the given ratio
- [ ] Parse ratio as float

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `linear 2.0` → `MATCH`
- [ ] `linear 4.0` → `MISMATCH`
- [ ] `quadratic 4.0` → `MATCH`
- [ ] `quadratic 2.0` → `MISMATCH`
- [ ] `cubic 3` → `ERROR: unknown class`

## Example data

Input:
- `linear 2.0`

Output:
- `MATCH`

## Suggested plan (no solution)
1. Parse class and ratio.
2. Apply the expected windows from the lesson’s doubling story.
3. Print MATCH / MISMATCH / ERROR.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `constant` expecting ratio near 1.
