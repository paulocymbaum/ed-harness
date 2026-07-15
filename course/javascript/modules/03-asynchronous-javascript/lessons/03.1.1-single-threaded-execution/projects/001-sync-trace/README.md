# Sync Trace

## Problem context
Debugging async bugs starts with knowing what runs synchronously on the call stack before any timer fires.

## Goal
Given a small **operation list** (not `eval`), walk it and print only labels that run in the **sync phase** — ignore `timeout` ops (and their nested bodies) because those callbacks are scheduled, not run now.

## Lesson concepts practiced
- [ ] Synchronous lines complete before scheduled callbacks
- [ ] `setTimeout(..., 0)` does not run during the current sync pass
- [ ] Nested timers schedule inner work only when the outer callback runs

## Functional requirements
- [ ] Provide snippets as data graphs under ids `basic`, `nested`, `chain` (already scaffolded)
- [ ] Implement `syncOrder(ops)`:
  - [ ] Walk top-level ops in order
  - [ ] For `{ type: "log", label }`, append `label`
  - [ ] For `{ type: "timeout", ... }`, **do not** append its label and **do not** walk `body` (that work is not sync)
- [ ] Read one stdin line (snippet id); print `Sync order: <labels>` or `ERROR: unknown snippet`
- [ ] Labels on the line are space-separated

## Non-functional requirements
- [ ] Do not use `eval`
- [ ] Do not hardcode answer strings like `"A C"` — derive them by walking the ops

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Input `basic` → `Sync order: A C`
- [ ] Input `nested` → `Sync order: 1 4`
- [ ] Input `chain` → `Sync order: start middle end`
- [ ] Input `unknown` → `ERROR: unknown snippet`
- [ ] Output never includes timer labels (`B`, `2`, `3`, `later`)

## Example data

Input:
- `basic`

Output:
- `Sync order: A C`

## Suggested plan (no solution)
1. Read the snippet id and look up its ops array.
2. Implement `syncOrder` to collect only `type: "log"` at the top level.
3. Print `Sync order: …` or the unknown-snippet error.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `fullOrder(ops)` that simulates timeout firing (including nested bodies) for compare-and-contrast.
