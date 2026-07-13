# Edge Case Flag Reporter

## Problem context

Before submitting a solution, a developer keeps a short line of tags naming which edge cases they've already thought through. A tool that echoes back exactly which known categories are present — sorted, de-duplicated — makes the pre-submission checklist easier to verify at a glance.

## Goal

Read one line of space-separated tokens from stdin and print which of the known edge-case categories (`empty`, `zero`, `neg`, `single`) are present, sorted alphabetically and space-separated, or `none` if none are present.

## Lesson concepts practiced
- [ ] HackerRank grades per test case, and hidden cases often target empty, zero, negative, and single-element inputs
- [ ] Only the four known category tokens are recognized — everything else in the line is noise to ignore
- [ ] The four categories form a reusable pre-submission checklist, not something tied to one specific problem

## Functional requirements
- [ ] Read a single line from stdin containing space-separated tokens
- [ ] Recognize exactly four category tokens: `empty`, `zero`, `neg`, `single`
- [ ] Print the recognized categories that appear in the input, de-duplicated, sorted alphabetically, separated by single spaces
- [ ] If no recognized category token is present, print `none`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `reportFlags(tokens)` helper is enough
- [ ] Error handling: unrecognized tokens are ignored, not treated as errors
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Split the input line on whitespace; trim the line before splitting

## Acceptance criteria
- [ ] Input `zero neg` → stdout `neg zero`
- [ ] Input `single` → stdout `single`
- [ ] Input with no recognized tokens (or an empty line) → stdout `none`
- [ ] Input `neg empty zero` → stdout `empty neg zero`
- [ ] Duplicate tokens (e.g. `zero zero`) appear only once in the output

## Example data

Sample stdin:
```text
zero neg
```

Sample stdout:
```text
neg zero
```

Another run, stdin:
```text
single
```

Sample stdout:
```text
single
```

## Suggested plan (no solution)
1. Read one line from stdin, trim it, and split it into tokens on whitespace.
2. Implement `reportFlags(tokens)`: keep only the four recognized categories, de-duplicate, and sort alphabetically.
3. Join the surviving categories with a single space, or print `none` if the list is empty.
4. Mentally check the duplicate-token case and the no-recognized-token case from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a fifth category, e.g. `duplicate`, and extend the recognized set
- [ ] Accept multiple lines (one flag set per line until EOF) and print one report line per input line
