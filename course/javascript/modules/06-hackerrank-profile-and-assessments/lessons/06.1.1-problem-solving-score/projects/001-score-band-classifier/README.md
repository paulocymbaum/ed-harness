# Score Band Classifier

## Problem context

A team dashboard wants to triage a long list of candidate profiles by their raw Problem-Solving Score without making a human read every number. It needs a small tool that turns one raw score into a consistent band label.

## Goal

Read one integer score (0-100) from stdin and print the band it falls into: `beginner`, `intermediate`, or `advanced`.

## Lesson concepts practiced
- [ ] Score only reflects passing submissions, read here as one already-computed number
- [ ] Reading a score at a glance is easier with bands than with the raw number
- [ ] Band boundaries are inclusive on the low end of each band (`40` and `70` belong to the higher band)

## Functional requirements
- [ ] Read a single integer score from stdin (one line)
- [ ] Score strictly below `40` → print `beginner`
- [ ] Score from `40` up to and including `69` → print `intermediate`
- [ ] Score `70` or above → print `advanced`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(score)` helper is enough
- [ ] Error handling: assume the input is always a valid integer in range 0-100
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input line may have surrounding whitespace — trim before parsing

## Acceptance criteria
- [ ] Score `0` → stdout `beginner`
- [ ] Score `39` → stdout `beginner`
- [ ] Score `40` → stdout `intermediate`
- [ ] Score `69` → stdout `intermediate`
- [ ] Score `70` → stdout `advanced`
- [ ] Score `100` → stdout `advanced`

## Example data

Sample stdin:
```text
55
```

Sample stdout:
```text
intermediate
```

Another run, stdin:
```text
70
```

Sample stdout:
```text
advanced
```

## Suggested plan (no solution)
1. Read one line from stdin and parse it as an integer.
2. Implement `classify(score)` using the three threshold rules from the lesson.
3. Print the result plus a newline.
4. Mentally check all six boundary values from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple scores (one per line until EOF) and print one band per line
- [ ] Add a fourth band, e.g. `expert` for scores `90` and above
