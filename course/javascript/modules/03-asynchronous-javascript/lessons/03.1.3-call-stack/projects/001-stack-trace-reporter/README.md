# Stack Trace Reporter

## Problem context
Debugging sync bugs means knowing what is on the **call stack** when a line runs. You need a tiny reporter that, for known snippets, prints frames top-to-bottom at a labeled moment — without guessing async order.

## Goal
Read a snippet id from `stdin` and print the call stack (top → bottom) at a fixed log moment for that snippet.

## Lesson concepts practiced
- [ ] Calls **push** frames; returns **pop** them (last in, first out).
- [ ] Inner functions must complete before the line after the call in the outer function runs.
- [ ] Long-running or infinitely recursive synchronous code keeps the stack busy.

## Functional requirements
- [ ] Hardcode at least 3 snippets: `basic`, `nested`, `overflow-note`.
- [ ] `basic`: lesson `first`/`second` example — at the moment `"second"` prints, stack top→bottom is `second first`.
- [ ] `nested`: lesson `a`/`b` example — at the moment `"b"` prints, stack top→bottom is `b a`.
- [ ] `overflow-note`: print `ERROR: stack would overflow` (do not recurse forever).
- [ ] Read one line (snippet id); print `Stack: <frames>` with space-separated names, or the overflow error, or `ERROR: unknown snippet`.

## Non-functional requirements
- [ ] Do not execute recursive overflow snippets
- [ ] Clear error for unknown ids
- [ ] No `eval`

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `basic` → `Stack: second first`
- [ ] Input `nested` → `Stack: b a`
- [ ] Input `overflow-note` → `ERROR: stack would overflow`
- [ ] Input `unknown` → `ERROR: unknown snippet`

## Example data

Input:
- `basic`

Output:
- `Stack: second first`

## Suggested plan (no solution)
1. Map snippet ids to fixed stack strings or error messages from the lesson.
2. Read one stdin line and look up the map.
3. Print the labeled stack or error.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a fourth snippet with three nested frames and report the stack at the innermost log.
