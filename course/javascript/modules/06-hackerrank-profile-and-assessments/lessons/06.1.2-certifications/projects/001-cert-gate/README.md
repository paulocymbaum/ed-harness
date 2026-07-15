# Cert Gate

## Problem context

A profile-badge renderer needs to decide, for one certification attempt, whether to show a `verified` credential or nothing at all. It should never show a partial or ambiguous state — HackerRank certifications are binary.

## Goal

Read one line from stdin describing a certification attempt outcome (`passed` or `failed`) and print the profile-facing label: `verified` or `not-verified`.

## Lesson concepts practiced
- [ ] A certification attempt is graded as pass/fail for the whole attempt, never partial
- [ ] Only a `passed` attempt should produce a `verified` credential
- [ ] A `failed` attempt maps to `not-verified` — it isn't a penalty state, just "no badge yet"

## Functional requirements
- [ ] Read a single line from stdin containing `passed` or `failed`
- [ ] Outcome `passed` → print `verified`
- [ ] Outcome `failed` → print `not-verified`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(outcome)` helper is enough
- [ ] Error handling: assume the input is always exactly `passed` or `failed`
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input line may have surrounding whitespace — trim before comparing

## Acceptance criteria
- [ ] Outcome `passed` → stdout `verified`
- [ ] Outcome `failed` → stdout `not-verified`

## Example data

Sample stdin:
```text
passed
```

Sample stdout:
```text
verified
```

Another run, stdin:
```text
failed
```

Sample stdout:
```text
not-verified
```

## Suggested plan (no solution)
1. Read one line from stdin and trim it into `outcome`.
2. Implement `classify(outcome)` using the two-rule mapping from the lesson.
3. Print the result plus a newline.
4. Mentally check both `passed` and `failed` against the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple attempts (one per line until EOF) and print one label per line
- [ ] Track the certification skill name alongside the outcome and echo it back with the label
