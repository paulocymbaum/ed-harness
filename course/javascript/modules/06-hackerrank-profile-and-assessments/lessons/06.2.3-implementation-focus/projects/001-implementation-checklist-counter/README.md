# Implementation Checklist Counter

## Problem context

Before submitting an implementation-heavy solution, a developer jots down one checklist line per spec rule, marking each `[x]` (done) or `[ ]` (todo). A small tool should turn that scratch checklist into one honest completeness summary.

## Goal

Read lines of a checklist from stdin until end-of-input and print how many are marked done versus todo, as `done=<A> todo=<B>`.

## Lesson concepts practiced
- [ ] Implementation problems reward completeness — a checklist tracks whether every spec rule is covered
- [ ] Only lines starting with the exact `[x]` or `[ ]` markers count; anything else is ignored
- [ ] "Done" tracks coverage, not correctness — it's still worth re-checking done items if a test fails

## Functional requirements
- [ ] Read lines from stdin until EOF (any number of lines, including zero)
- [ ] A line starting with `[x]` counts toward `done`
- [ ] A line starting with `[ ]` counts toward `todo`
- [ ] Any other line (including blank lines) is ignored — it does not count toward either total
- [ ] Print exactly one line: `done=<A> todo=<B>`, where `<A>` and `<B>` are the counts

## Non-functional requirements
- [ ] Readability: a single `countChecklist(lines)` helper is enough
- [ ] Error handling: no special requirement — malformed lines are simply ignored
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Match markers at the **start** of the line only (after trimming leading whitespace); do not match `[x]` anywhere else in the line

## Acceptance criteria
- [ ] Two `[x]` lines and two `[ ]` lines → stdout `done=2 todo=2`
- [ ] Zero lines of input → stdout `done=0 todo=0`
- [ ] All lines are `[x]` → `todo=0` in the output
- [ ] A blank line mixed in does not get counted as either done or todo

## Example data

Sample stdin:
```text
[x] parse input
[ ] handle negative numbers
[x] print result
[ ] handle empty input
```

Sample stdout:
```text
done=2 todo=2
```

## Suggested plan (no solution)
1. Read every line from stdin until EOF into an array.
2. Implement `countChecklist(lines)`: for each line, check if it starts with `[x]` or `[ ]` (after trimming) and tally accordingly.
3. Print `done=<A> todo=<B>` plus a newline.
4. Mentally check the empty-input case and a case where every line is the same marker.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the todo item texts as a follow-up list below the summary line
- [ ] Support a third marker, e.g. `[~]` for "in review", tracked as a separate count
