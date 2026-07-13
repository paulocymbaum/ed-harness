# Rank Tier Classifier

## Problem context

A scouting spreadsheet lists hundreds of contest ranks and needs a quick tier label per row instead of the raw number, so a reviewer can scan for standout profiles without doing the arithmetic themselves.

## Goal

Read one integer rank from stdin and print its tier: `top-100`, `top-1000`, or `open`.

## Lesson concepts practiced
- [ ] A smaller rank number is a stronger signal — rank works opposite to score
- [ ] Tier boundaries are inclusive on the low end (`100` and `1000` belong to the stronger tier)
- [ ] Most profiles fall into `open`, which is expected and not a weak signal by itself

## Functional requirements
- [ ] Read a single integer rank from stdin (one line)
- [ ] Rank `100` or below → print `top-100`
- [ ] Rank above `100` and up to `1000` → print `top-1000`
- [ ] Rank above `1000` → print `open`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(rank)` helper is enough
- [ ] Error handling: assume the input is always a positive integer
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input line may have surrounding whitespace — trim before parsing

## Acceptance criteria
- [ ] Rank `1` → stdout `top-100` (a smaller rank number is always the stronger outcome)
- [ ] Rank `100` → stdout `top-100` (the boundaries are inclusive on the low end of each tier)
- [ ] Rank `101` → stdout `top-1000`
- [ ] Rank `1000` → stdout `top-1000` (still inclusive, since contest rank tiers keep the boundary value)
- [ ] Rank `1001` → stdout `open`
- [ ] Rank `15234` → stdout `open` (most profiles fall in `open`, which is expected)

## Example data

Sample stdin:
```text
842
```

Sample stdout:
```text
top-1000
```

Another run, stdin:
```text
57
```

Sample stdout:
```text
top-100
```

## Suggested plan (no solution)
1. Read one line from stdin and parse it as an integer.
2. Implement `classify(rank)` using the two threshold rules from the lesson.
3. Print the result plus a newline.
4. Mentally check both boundary values (`100`, `1000`) and one value just past each from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple ranks (one per line until EOF) and print one tier per line
- [ ] Add a `top-10` tier for ranks `10` and below, nested above `top-100`
