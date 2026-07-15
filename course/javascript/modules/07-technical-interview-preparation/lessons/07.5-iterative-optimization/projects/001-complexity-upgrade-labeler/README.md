# Complexity Upgrade Labeler

## Problem context

Practicing the brute force → better → optimal narration is easier when you can instantly recall the complexity tag that goes with each stage. A quick CLI drill turns that recall into muscle memory before you have to say it out loud in an interview.

## Goal

Read one line from stdin containing `brute`, `better`, or `optimal` and print the target complexity tag associated with that narration stage: `O(n^2)`, `O(n log n)`, or `O(n)`.

## Lesson concepts practiced
- [ ] The brute-force stage of a solution is typically O(n^2) (e.g. nested loops checking every pair)
- [ ] The better stage often reaches O(n log n) (e.g. sorting first, then a linear scan)
- [ ] The optimal stage often reaches O(n) by trading space for time (e.g. a hash map)
- [ ] Naming the complexity out loud at each narration stage is what interviewers listen for

## Functional requirements
- [ ] Read exactly one line from stdin containing `brute`, `better`, or `optimal`
- [ ] Print `O(n^2)` when the line is `brute`
- [ ] Print `O(n log n)` when the line is `better`
- [ ] Print `O(n)` when the line is `optimal`
- [ ] Output is a single line ending with a newline

## Non-functional requirements
- [ ] Readability and maintainability: use a single lookup map keyed by stage name, not three duplicated `if` branches
- [ ] Error handling: unrecognized input may throw or print an error (no special requirement)
- [ ] Performance (when applicable): O(1) lookup, trivial for this input size

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Input is exactly one of the three lowercase stage names: `brute`, `better`, `optimal`
- [ ] Print the complexity tags exactly as shown, including the `O(...)` notation and the caret-free `n^2` spelling

## Acceptance criteria
- [ ] stdin `brute` → stdout `O(n^2)`
- [ ] stdin `better` → stdout `O(n log n)`
- [ ] stdin `optimal` → stdout `O(n)`
- [ ] Output has no extra text before or after the complexity tag

## Example data

Input:
```text
brute
```

Output:
```text
O(n^2)
```

Input:
```text
optimal
```

Output:
```text
O(n)
```

## Suggested plan (no solution)
1. Read the single stdin line and trim it.
2. Build a lookup object mapping `brute` → `O(n^2)`, `better` → `O(n log n)`, `optimal` → `O(n)`.
3. Print the looked-up value followed by a newline.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a fourth stage `constant` that maps to `O(1)`
- [ ] Print a short one-sentence example technique alongside the tag (e.g. "O(n) — hash map, one pass")
