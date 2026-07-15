# CAP Trade-off Labeler

## Problem context

During a system design discussion, an interviewer names a trade-off (CP, AP, or CA) and expects you to instantly name **what it costs**. A quick CLI drill turns that recall into muscle memory: given the pair, name the sacrificed guarantee.

## Goal

Read one line from stdin containing `CP`, `AP`, or `CA` and print the single guarantee that pair sacrifices during a network partition: `availability`, `consistency`, or `partition-tolerance`.

## Lesson concepts practiced
- [ ] CP keeps Consistency + Partition tolerance and sacrifices Availability
- [ ] AP keeps Availability + Partition tolerance and sacrifices Consistency
- [ ] CA assumes no partitions, so it sacrifices Partition tolerance
- [ ] Naming the sacrificed guarantee (not the two kept) is the useful interview signal

## Functional requirements
- [ ] Read exactly one line from stdin containing `CP`, `AP`, or `CA`
- [ ] Print `availability` when the line is `CP`
- [ ] Print `consistency` when the line is `AP`
- [ ] Print `partition-tolerance` when the line is `CA`
- [ ] Output is a single line ending with a newline

## Non-functional requirements
- [ ] Readability and maintainability: a single lookup table/map, no chained `if/else` per branch duplicated
- [ ] Error handling: unrecognized input may throw or print an error (no special requirement)
- [ ] Performance (when applicable): O(1) lookup, trivial for this input size

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Input is exactly one of the three uppercase pairs: `CP`, `AP`, `CA`
- [ ] Do not hardcode all logic as three separate `if` blocks with repeated `console.log` calls — prefer a map/lookup keyed by the pair

## Acceptance criteria
- [ ] stdin `CP` → stdout `availability`
- [ ] stdin `AP` → stdout `consistency`
- [ ] stdin `CA` → stdout `partition-tolerance`
- [ ] Output has no extra text before or after the single guarantee word

## Example data

Input:
```text
CP
```

Output:
```text
availability
```

Input:
```text
AP
```

Output:
```text
consistency
```

## Suggested plan (no solution)
1. Read the single stdin line and trim it.
2. Build a lookup object mapping `CP` → `availability`, `AP` → `consistency`, `CA` → `partition-tolerance`.
3. Print the looked-up value followed by a newline.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept lowercase input (`cp`, `ap`, `ca`) by normalizing case before lookup
- [ ] Print a one-sentence justification alongside the guarantee (e.g. "availability — some requests fail during a split")
