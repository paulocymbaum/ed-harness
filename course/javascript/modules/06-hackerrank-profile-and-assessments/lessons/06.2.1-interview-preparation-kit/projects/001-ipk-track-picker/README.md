# IPK Track Picker

## Problem context

A study-planner CLI asks the user for one topic keyword and needs to route them to the right Interview Preparation Kit focus area, using a fixed mapping instead of guessing.

## Goal

Read one topic keyword from stdin and print the recommended kit focus line for it, using a fixed mapping.

## Lesson concepts practiced
- [ ] IPK groups problems by topic so each session reinforces one recurring pattern
- [ ] `Warmup` is meant to build momentum, not depth, and is a distinct bucket from `Arrays`/`Strings`
- [ ] An unrecognized keyword should route to a general/mixed catch-all instead of failing

## Functional requirements
- [ ] Read a single keyword from stdin (one line)
- [ ] Keyword `arrays` → print `Arrays: traversal and manipulation`
- [ ] Keyword `strings` → print `Strings: parsing and building`
- [ ] Keyword `warmup` → print `Warmup: build momentum first`
- [ ] Any other keyword → print `General: mixed topic practice`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `recommend(keyword)` helper is enough
- [ ] Error handling: unrecognized keywords fall into the catch-all instead of throwing
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input line may have surrounding whitespace — trim before comparing (case-sensitive match on the four known keywords)

## Acceptance criteria
- [ ] Keyword `arrays` → stdout `Arrays: traversal and manipulation`
- [ ] Keyword `strings` → stdout `Strings: parsing and building`
- [ ] Keyword `warmup` → stdout `Warmup: build momentum first`
- [ ] Keyword `other` → stdout `General: mixed topic practice`
- [ ] Keyword `dp` (unrecognized) → stdout `General: mixed topic practice`

## Example data

Sample stdin:
```text
arrays
```

Sample stdout:
```text
Arrays: traversal and manipulation
```

Another run, stdin:
```text
dp
```

Sample stdout:
```text
General: mixed topic practice
```

## Suggested plan (no solution)
1. Read one line from stdin and trim it into `keyword`.
2. Implement `recommend(keyword)` using the fixed mapping from the lesson, with a catch-all default.
3. Print the result plus a newline.
4. Mentally check all three known keywords plus one unrecognized keyword from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add more recognized topics (e.g. `dp`, `trees`, `graphs`) with their own focus lines
- [ ] Make matching case-insensitive (`Arrays` and `arrays` both route the same way)
