# Score Pipeline

## Problem context

Grading scripts often keep only scores at or above a threshold, then label them for a report. Building that pipeline with **arrow callbacks** passed to `filter` and `map` keeps the transforms short and reusable.

## Goal

Read a threshold and a list of scores from stdin, keep passing scores with an arrow callback, label them with another arrow callback, and print one label per line.

## Lesson concepts practiced

- [ ] Arrow = function value; store it, pass it, return it.
- [ ] `(args) => expression` returns the expression; `(args) => { ... }` needs `return`.
- [ ] Callbacks are just functions passed as arguments — `map`/`filter` call yours once per item.

## Functional requirements

- [ ] Read stdin: line 1 = `threshold`, line 2 = count `n`, then exactly `n` score lines.
- [ ] Parse all values with `Number`. If any value is not finite → print `ERROR: invalid number` and stop.
- [ ] If `n < 0` → print `ERROR: invalid count` and stop.
- [ ] Define arrow helpers (store as values): `isPassing` and `labelPass` (expression-body arrows).
- [ ] Use `scores.filter(isPassing)` then `.map(labelPass)` — do not rewrite the loop by hand.
- [ ] Print each resulting label on its own line (no extra blank line at the end required beyond newlines after each label).
- [ ] If no score passes, print nothing (empty stdout).

## Non-functional requirements

- [ ] Prefer short expression-body arrows for the callbacks
- [ ] Keep parsing/validation separate from the filter/map pipeline
- [ ] No `console.log` inside the arrow helpers — they only return values

## Constraints

- [ ] Node.js only
- [ ] No external libraries
- [ ] Must use `filter` and `map` with arrow callbacks (named or inline)

## Acceptance criteria

- [ ] Threshold `60`, scores `40`, `70`, `90` → `Pass:70` then `Pass:90` (via `filter` + `map` arrow callbacks)
- [ ] Threshold `50`, scores `50`, `49` → `Pass:50`
- [ ] Threshold `80`, scores `70`, `75` → empty output
- [ ] Non-numeric score → `ERROR: invalid number`
- [ ] Arrow helpers return values (expression body); they do not print inside the callback

## Example data

Input:

- `60`
- `3`
- `40`
- `70`
- `90`

Output:

- `Pass:70`
- `Pass:90`

## Suggested plan (no solution)

1. Read `threshold`, `n`, then `n` score lines; validate with `Number.isFinite`.
2. Write `const isPassing = (s) => s >= threshold` and `const labelPass = (s) => "Pass:" + s`.
3. Pipeline: `filter(isPassing).map(labelPass)`.
4. Print each label with `process.stdout.write(label + "\n")`.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)

- [ ] Add a failing branch: map non-passing scores to `"Fail:" + s` and print both lists.
- [ ] Accept an optional third helper `applyTwice(fn, value)` and demonstrate it on one score.
