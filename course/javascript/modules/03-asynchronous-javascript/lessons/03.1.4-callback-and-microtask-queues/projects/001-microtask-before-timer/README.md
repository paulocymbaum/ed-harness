# Microtask Before Timer

## Problem context
Mixing Promises and timers causes ordering bugs when developers assume `setTimeout(0)` runs immediately.

## Goal
Schedule the lesson's canonical snippet for real (sync logs + one Promise microtask + one `setTimeout(0)`), then print the **observed** output order and confirm the microtask ran before the timer.

## Lesson concepts practiced
- [ ] Promise reactions are microtasks
- [ ] Microtasks drain before the next task
- [ ] `setTimeout(0)` schedules a task, not immediate execution

## Functional requirements
- [ ] In `main()`, record labels into an array via a `log(label)` helper (do not hardcode the final order string up front)
- [ ] Schedule exactly this pattern (labels must be these strings):
  - [ ] sync: `start`
  - [ ] `Promise.resolve().then(...)` logs `micro`
  - [ ] `setTimeout(..., 0)` logs `timer`, then prints the three output lines
  - [ ] sync: `end` (after scheduling, before the event loop continues)
- [ ] After the timer fires, print exactly:
  - [ ] `order: <space-separated labels in observed order>`
  - [ ] `rule: microtasks drain before the next task`
  - [ ] `micro_before_timer: true` or `false` from comparing positions of `micro` and `timer` in the observed array
- [ ] Do not print the answer before the timer callback runs

## Non-functional requirements
- [ ] Do not use `eval`
- [ ] Order line must come from the runtime array, not a pre-written constant for the full sequence

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Running `node starter/index.js` prints `order: start end micro timer`
- [ ] Rule line is exactly `rule: microtasks drain before the next task`
- [ ] `micro_before_timer: true` is printed
- [ ] Implementation schedules a Promise and a timer (not only `stdout.write` of fixed lines)

## Example data

Output:

```
order: start end micro timer
rule: microtasks drain before the next task
micro_before_timer: true
```

## Suggested plan (no solution)
1. Create `order = []` and `log(label)` that pushes into it.
2. Log `start`, schedule microtask and timer, log `end`.
3. Inside the timer callback, log `timer`, then print the three lines from `order`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a second mode that chains `.then` (`m1` `m2`) before `t1` and prints that order too.
