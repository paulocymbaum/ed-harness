# Stack Trace Reporter

## Problem context
Debugging sync bugs means knowing what is on the **call stack** when a line runs. You need a tiny simulator that walks function graphs (no `eval`) and reports frames top→bottom at a labeled log moment.

## Goal
Implement `stackAtProbe(snippet)`: push/pop frames on `call`, and when a `log` label matches `snippet.probe`, capture the current stack (top → bottom). Read a snippet id from stdin and print `Stack: …` or an error.

## Lesson concepts practiced
- [ ] Calls **push** frames; returns **pop** them (last in, first out)
- [ ] Inner functions must complete before the line after the call in the outer function runs
- [ ] Unbounded synchronous recursion keeps growing the stack until it would overflow

## Functional requirements
- [ ] Snippets `basic`, `nested`, and `overflow-note` are provided as data graphs (scaffold)
- [ ] Implement `stackAtProbe(snippet)`:
  - [ ] Maintain a stack array of function names
  - [ ] On `{ type: "call", target }`: if depth would exceed `MAX_DEPTH`, treat as overflow; else push `target`, run `snippet.functions[target]`, then pop
  - [ ] On `{ type: "log", label }`: if `label === snippet.probe`, capture frames **top → bottom** (newest name first)
  - [ ] Start by executing `snippet.entry`
- [ ] CLI: read one snippet id; print:
  - [ ] `Stack: <frames>` (space-separated) when a probe capture exists
  - [ ] `ERROR: stack would overflow` for unbounded recursion (overflow-note)
  - [ ] `ERROR: unknown snippet` for unknown ids
- [ ] Do not hardcode answer strings like `"second first"` — derive them from the simulator

## Non-functional requirements
- [ ] Do not use real infinite recursion or `eval`
- [ ] Cap depth with `MAX_DEPTH` (scaffold constant)
- [ ] Clear errors for unknown ids / overflow

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `basic` → `Stack: second first`
- [ ] Input `nested` → `Stack: b a`
- [ ] Input `overflow-note` → `ERROR: stack would overflow`
- [ ] Input `unknown` → `ERROR: unknown snippet`
- [ ] Stack lines come from push/pop simulation, not a lookup table of answers

## Example data

Input:
- `basic`

Output:
- `Stack: second first`

## Suggested plan (no solution)
1. Walk `entry` ops with a recursive `exec(ops)` helper and a `stack` array.
2. On `call`, push/pop around running the target body; abort if `stack.length >= MAX_DEPTH`.
3. On matching `log`, save `[...stack].reverse()` (or push to front — top first).
4. Wire stdin id → snippet → print `Stack:` / overflow / unknown.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a fourth snippet with three nested frames and report the stack at the innermost log.
