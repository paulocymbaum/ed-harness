# Badge Progress Reporter

## Problem context

A profile widget needs to render one badge tier's progress as a short status line, using the raw `earned` and `total` counts stored for that tier.

## Goal

Read two integers from stdin — `earned` and `total` — and print the tier status (`complete` or `in-progress`) followed by the `earned/total` fraction.

## Lesson concepts practiced
- [ ] A badge tier is `complete` only when `earned` equals `total` exactly
- [ ] Any `earned` strictly less than `total` is `in-progress`, even one solve away from completion
- [ ] The fraction is always reported as `earned/total`, in that order

## Functional requirements
- [ ] Read two integers from stdin: `earned` and `total`, one per line
- [ ] If `earned` equals `total` → status is `complete`
- [ ] If `earned` is less than `total` → status is `in-progress`
- [ ] Print exactly one line: `<status> <earned>/<total>`
- [ ] Output ends with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(earned, total)` helper is enough
- [ ] Error handling: assume `earned` is always less than or equal to `total`, both non-negative integers
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input lines may have surrounding whitespace — trim before parsing

## Acceptance criteria
- [ ] `earned=20, total=20` → stdout `complete 20/20`
- [ ] `earned=12, total=20` → stdout `in-progress 12/20`
- [ ] `earned=0, total=15` → stdout `in-progress 0/15`
- [ ] `earned=19, total=20` → stdout `in-progress 19/20`

## Example data

Sample stdin:
```text
12
20
```

Sample stdout:
```text
in-progress 12/20
```

Another run, stdin:
```text
20
20
```

Sample stdout:
```text
complete 20/20
```

## Suggested plan (no solution)
1. Read two lines from stdin and parse them as integers `earned` and `total`.
2. Implement `classify(earned, total)` to compute the status word.
3. Print `<status> <earned>/<total>` plus a newline.
4. Mentally check the exact-equal case and the one-away case from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] When `complete`, also print the next tier's `total` as a hint for what's needed next
- [ ] Accept multiple `earned total` pairs (one pair per two lines) and print one status line per pair
