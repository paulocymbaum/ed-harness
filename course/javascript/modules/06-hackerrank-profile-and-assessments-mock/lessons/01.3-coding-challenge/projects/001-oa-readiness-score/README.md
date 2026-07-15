# OA Readiness Score

## Problem context

Before a real Online Assessment (OA), it helps to combine a few practice signals — hours in the Interview Preparation Kit, whether the IPK topic set is done, whether you have an edge-case checklist ready, and whether you have run timed practice drills — into a single readiness verdict instead of guessing.

## Goal

Implement a program that reads four practice signals from stdin, computes a weighted readiness score, and prints whether that score clears the readiness threshold.

## Lesson concepts practiced

- [ ] Focused IPK practice compounds faster than random grinding — track hours as one input signal (06.2.1)
- [ ] OA time pressure rewards a plan → pace → rush mindset built from steady practice ahead of time (06.2.2)
- [ ] A pre-submission edge-case checklist (empty/zero/negative/single) is a reusable readiness signal, not a one-off habit (06.2.4)

## Functional requirements

- [ ] Read one line from `stdin` containing four space-separated integers: `hours ipk edges drills`.
- [ ] `hours` is practice hours, `0`–`40`; `ipk`, `edges`, and `drills` are each `0` or `1` flags.
- [ ] Compute `score = hours + 20 * ipk + 20 * edges + 20 * drills`.
- [ ] Cap `score` at `100` (never print a value above 100, even if the raw sum exceeds it).
- [ ] If `score >= 70`, the label is `ready`; otherwise the label is `not-ready`.
- [ ] Print the label and the (possibly capped) score on one line, separated by a single space: `<label> <score>`.

## Non-functional requirements

- [ ] Separate the score computation from the `console.log` / `process.stdout.write` call
- [ ] Keep the `20`-point weight and the `70` threshold as named constants, not repeated magic numbers

## Constraints

- [ ] Node.js only
- [ ] Exactly one line of stdin input with four space-separated integers

## Acceptance criteria

- [ ] `10 1 1 1` → `ready 70`
- [ ] `0 0 0 0` → `not-ready 0`
- [ ] `9 1 1 1` → `not-ready 69`
- [ ] `40 0 0 0` → `not-ready 40`
- [ ] `40 1 1 1` → `ready 100`
- [ ] A raw sum above 100 is capped and printed as `100`

## Example data

Input:

```
10 1 1 1
```

Output:

```
ready 70
```

## Suggested plan (no solution)

1. Read the single stdin line and split it on spaces into four numbers.
2. Compute the weighted score, then clamp it to a maximum of 100.
3. Compare the score against the 70 threshold and print the label and score.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)

## Extensions (optional)

- [ ] Print a per-signal breakdown (`hours`, `ipk`, `edges`, `drills` contributions) before the final line.
