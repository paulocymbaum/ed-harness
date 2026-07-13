# TDZ Access Reporter

## Problem context

A static-analysis linter wants to explain *why* a given binding read is safe or unsafe, without actually executing the risky code. Given a binding kind and when it is read relative to its declaration, the tool must report the outcome a real JS engine would produce.

## Goal

Read one binding kind and one timing from stdin, and print the outcome that a real JS engine would produce for that combination: `undefined`, `ReferenceError`, or `ok`.

## Lesson concepts practiced
- [ ] `var` read before its declaration yields `undefined` (hoisted + auto-initialized)
- [ ] `let`/`const` read before their declaration throw a `ReferenceError` (Temporal Dead Zone)
- [ ] Any binding read **after** its declaration line behaves normally
- [ ] The TDZ ends at the declaration line, not at the end of the block

## Functional requirements
- [ ] Read two lines from stdin: binding kind (`var`, `let`, or `const`) and timing (`early` or `after`)
- [ ] If kind is `var` and timing is `early` → print `undefined`
- [ ] If kind is `let` or `const` and timing is `early` → print `ReferenceError`
- [ ] If timing is `after` (any kind) → print `ok`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `classify(kind, timing)` helper is enough
- [ ] Error handling: unrecognized kind/timing may throw (no special requirement)
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not actually execute a TDZ read (e.g. `console.log(x); let x;`) — this project simulates the rule as a string classifier, not a live experiment
- [ ] Input lines may have surrounding whitespace — trim before comparing

## Acceptance criteria
- [ ] Kind `var`, timing `early` → stdout `undefined`
- [ ] Kind `let`, timing `early` → stdout `ReferenceError`
- [ ] Kind `const`, timing `early` → stdout `ReferenceError`
- [ ] Kind `var`, timing `after` → stdout `ok`
- [ ] Kind `let`, timing `after` → stdout `ok`
- [ ] Kind `const`, timing `after` → stdout `ok`

## Example data

Input:
```text
let
early
```

Output:
```text
ReferenceError
```

Input:
```text
var
early
```

Output:
```text
undefined
```

Input:
```text
const
after
```

Output:
```text
ok
```

## Suggested plan (no solution)
1. Read two lines from stdin and trim them into `kind` and `timing`.
2. Implement `classify(kind, timing)` using the three rules from the lesson (var+early, let/const+early, anything+after).
3. Print the result plus a newline.
4. Mentally check all six kind/timing combinations against the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `function` kind that is always `ok` (function declarations are fully hoisted)
- [ ] Accept multiple kind/timing pairs (one per subsequent line pair) and print one tag per pair
