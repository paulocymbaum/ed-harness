# Termination Judge

## Problem context
A loop is wrong if it never exits. Termination arguments name a quantity that shrinks (or advances) on **every** branch and is bounded.

## Goal
Read a pattern id and print a termination judgment.

## Lesson concepts practiced
- [ ] Binary search window `hi - lo + 1` strictly shrinks → cannot run forever.
- [ ] `continue` paths that never move the index may loop forever.
- [ ] Collatz-style updates are believed to halt but are not a proof you should ship on.

## Functional requirements
- [ ] `binary-search` → `HALTS`
- [ ] `continue-stuck` → `MAY-LOOP`
- [ ] `collatz` → `UNPROVEN`
- [ ] Unknown → `ERROR: unknown pattern`

## Non-functional requirements
- [ ] Do not execute infinite loops
- [ ] Exact labels as above

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `binary-search` → `HALTS`
- [ ] `continue-stuck` → `MAY-LOOP`
- [ ] `collatz` → `UNPROVEN`
- [ ] `unknown` → `ERROR: unknown pattern`

## Example data

Input:
- `binary-search`

Output:
- `HALTS`

## Suggested plan (no solution)
1. Map pattern ids to lesson judgments.
2. Print the label for one stdin line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `two-pointer-reverse` → `HALTS`.
