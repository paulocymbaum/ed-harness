# Output Order Predictor

## Problem context
Teams keep getting mystery output orders when mixing sync code, timers, and promises. You need a harness that **runs** small demos and reports the observed order.

## Goal
Implement four demo runners that schedule real sync / microtask / task work through a harness, then print each snippet's observed order and per-label classification.

## Lesson concepts practiced
- [ ] Run sync code before microtasks and tasks
- [ ] Promise `.then` callbacks are microtasks
- [ ] `setTimeout(..., 0)` schedules a task that runs after microtasks drain

## Functional requirements
- [ ] Use the provided `createHarness()` (do not replace order with hardcoded answer strings)
- [ ] Implement four runners that use only `log`, `scheduleMicro`, and `scheduleTask` from the harness:
  - [ ] `basic`: sync `A`, micro `micro`, task `timer`, sync `B` → order `A B micro timer`
  - [ ] `asyncAwait`: sync `A`, micro `B` (scheduled at await-equivalent), sync `C` → order `A C B`
  - [ ] `chainedMicrotasks`: micro `m1` then micro `m2` from inside `m1`, task `t1` → order `m1 m2 t1`
  - [ ] `trick`: sync `start`/`end`, micro `micro`, task `timer` → order `start end micro timer`
- [ ] After all runners finish, print for each snippet:
  - [ ] `=== <name> ===`
  - [ ] `order: <labels>`
  - [ ] one indented line per label: `  <label>:<sync|microtask|task>`
  - [ ] `explanation: <one short sentence using call stack / microtask / task>`

## Non-functional requirements
- [ ] Do not use `eval`
- [ ] Classifications must come from the harness phase when `log` was called

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `basic` order is `A B micro timer` with correct classifications
- [ ] `chained-microtasks` order is `m1 m2 t1`
- [ ] `trick` order is `start end micro timer`
- [ ] All four snippets print when `main()` runs
- [ ] Order lines are derived from observed harness logs

## Example data

Snippet `basic` output (excerpt):

```
=== basic ===
order: A B micro timer
  A:sync
  B:sync
  micro:microtask
  timer:task
explanation: Sync runs first; the Promise microtask drains before the timer task.
```

## Suggested plan (no solution)
1. Read how `createHarness` tags sync vs microtask vs task.
2. Implement each runner with `log` / `scheduleMicro` / `scheduleTask`.
3. Format with `formatSnippet` and print all four.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a fifth runner with nested timers after microtasks.
