# Stack Depth Classifier

## Problem context
The same process can be recursive or iterative. In JavaScript, linear-depth recursion for large `n` is unsafe.

## Goal
Read an approach id and print a stack-safety label.

## Lesson concepts practiced
- [ ] Deep recursion → `RangeError: Maximum call stack size exceeded`.
- [ ] JS engines do **not** reliably optimize tail calls — iterate when depth is linear in `n`.
- [ ] Prefer recursion for hierarchical structure; prefer iteration when depth can be huge.

## Functional requirements
- [ ] `iter-factorial` → `SAFE`
- [ ] `rec-factorial-deep` → `OVERFLOW-RISK`
- [ ] `tree-walk` → `NATURAL-REC`
- [ ] Unknown → `ERROR: unknown approach`

## Non-functional requirements
- [ ] Do not actually recurse to overflow
- [ ] Exact labels as above

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `iter-factorial` → `SAFE`
- [ ] `rec-factorial-deep` → `OVERFLOW-RISK`
- [ ] `tree-walk` → `NATURAL-REC`
- [ ] `unknown` → `ERROR: unknown approach`

## Example data

Input:
- `rec-factorial-deep`

Output:
- `OVERFLOW-RISK`

## Suggested plan (no solution)
1. Map approach ids to lesson guidance.
2. Print the label for one stdin line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `explicit-stack-walk` → `SAFE`.
