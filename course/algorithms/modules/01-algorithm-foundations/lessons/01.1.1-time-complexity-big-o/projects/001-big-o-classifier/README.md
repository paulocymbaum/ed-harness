# Big-O Classifier

## Problem context
Before optimizing JavaScript, you need to classify how work **grows** with `n`. Interview prompts often show small snippets and ask for Big-O.

## Goal
Read a snippet id from stdin and print the time complexity class for that hardcoded snippet.

## Lesson concepts practiced
- [ ] Nested loops over `n` × `n` → `O(n²)`, even if the body is tiny.
- [ ] Halving `n` each step (binary search style) → `O(log n)`.
- [ ] Big-O is about **growth**, not absolute milliseconds on your laptop.

## Functional requirements
- [ ] Support ids: `constant`, `linear`, `quadratic`, `log`, `nlogn`.
- [ ] Print exactly one of: `O(1)`, `O(n)`, `O(n^2)`, `O(log n)`, `O(n log n)`.
- [ ] Unknown id → `ERROR: unknown snippet`.

## Non-functional requirements
- [ ] No timing / microbenchmarks — classify from structure only
- [ ] Deterministic string output

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `constant` → `O(1)`
- [ ] `linear` → `O(n)`
- [ ] `quadratic` → `O(n^2)`
- [ ] `log` → `O(log n)`
- [ ] `nlogn` → `O(n log n)`
- [ ] `unknown` → `ERROR: unknown snippet`

## Example data

Input:
- `quadratic`

Output:
- `O(n^2)`

## Suggested plan (no solution)
1. Map each id to the class from the lesson table / examples.
2. Read one trimmed stdin line and look up the map.
3. Print the class or the error string.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `sum-twice` id that is still `O(n)` (two sequential passes).
