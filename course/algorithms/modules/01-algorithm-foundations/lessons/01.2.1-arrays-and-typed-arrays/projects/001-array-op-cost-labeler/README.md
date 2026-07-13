# Array Op Cost Labeler

## Problem context
Choosing the wrong Array method (e.g. `shift` in a queue) quietly turns an algorithm into `O(n²)`.

## Goal
Read an operation id and print its typical cost label.

## Lesson concepts practiced
- [ ] Read/write `arr[i]` → expected `O(1)`; `shift` / `unshift` → `O(n)`.
- [ ] `push` / `pop` at the end → amortized `O(1)`.
- [ ] Prefer plain `Array` for mixed values; `TypedArray` for fixed-width numeric buffers.

## Functional requirements
- [ ] `index` → `O(1)`
- [ ] `push` → `amortized O(1)`
- [ ] `shift` → `O(n)`
- [ ] `includes` → `O(n)`
- [ ] `typed-fixed` → `typed-array`
- [ ] Unknown → `ERROR: unknown op`

## Non-functional requirements
- [ ] Exact labels as above
- [ ] No microbenchmarks

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `index` → `O(1)`
- [ ] `push` → `amortized O(1)`
- [ ] `shift` → `O(n)`
- [ ] `includes` → `O(n)`
- [ ] `typed-fixed` → `typed-array`
- [ ] `unknown` → `ERROR: unknown op`

## Example data

Input:
- `shift`

Output:
- `O(n)`

## Suggested plan (no solution)
1. Map operation ids to lesson cost notes.
2. Print the label for one stdin line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `spread-typed` → `O(n) copy`.
