# Big-O Classifier

## Problem context

A code review bot needs to tag snippets by their time complexity shape before a human reviewer looks at them. Instead of parsing real JavaScript, it works from a simplified label describing the loop pattern the snippet uses, and must map that label to the matching Big-O class.

## Goal

Read one pattern label from stdin and print the Big-O complexity class that pattern represents.

## Lesson concepts practiced
- [ ] A single loop over the input is `O(n)`.
- [ ] A loop nested inside another loop is `O(n^2)`.
- [ ] Halving the search range every step (binary search) is `O(log n)`.
- [ ] No loop, fixed number of operations is `O(1)`.

## Functional requirements
- [ ] Read exactly one line from stdin containing a pattern label
- [ ] Map `single-loop` → `O(n)`
- [ ] Map `nested-loop` → `O(n^2)`
- [ ] Map `binary-search` → `O(log n)`
- [ ] Map `constant` → `O(1)`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(pattern)` lookup/helper is enough
- [ ] Error handling: unrecognized labels may throw (no special requirement)
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Input line may have surrounding whitespace — trim before comparing
- [ ] The four labels are case-sensitive and always lowercase kebab-case as shown

## Acceptance criteria
- [ ] Kind `single-loop` → stdout `O(n)`
- [ ] Kind `nested-loop` → stdout `O(n^2)`
- [ ] Kind `binary-search` → stdout `O(log n)`
- [ ] Kind `constant` → stdout `O(1)`

## Example data

Input:
```text
nested-loop
```

Output:
```text
O(n^2)
```

Input:
```text
binary-search
```

Output:
```text
O(log n)
```

## Suggested plan (no solution)
1. Read one line from stdin and trim it into `pattern`.
2. Implement `classify(pattern)` using the four label → complexity mappings from the lesson.
3. Print the result plus a newline.
4. Mentally check all four labels against the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `log-linear` label mapping to `O(n log n)` (e.g. merge sort)
- [ ] Accept multiple labels (one per line) and print one complexity per line
