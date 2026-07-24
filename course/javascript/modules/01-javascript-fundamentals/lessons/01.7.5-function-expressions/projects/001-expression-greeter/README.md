# Expression Greeter

## Problem context
A CLI greeting tool should keep the formatting logic as a reusable **function expression** bound to a `const` — not a declaration — so the value can be passed around later if needed.

## Goal
Implement `formatGreeting` as a function expression, read one name from stdin, and print the greeting.

## Lesson concepts practiced
- [ ] `const f = function (…) { … }` stores a function value in `f`.
- [ ] Call with `f(args)` only after the assignment line has run.
- [ ] Expressions are not hoisted like `function name() {}` declarations.

## Functional requirements
- [ ] Define `const formatGreeting = function (name) { … }` that **returns** `"Hello, " + name + "!"`.
- [ ] Read one line from `stdin` as the name (trim whitespace).
- [ ] Empty name → print `ERROR: empty name`.
- [ ] On success, print the returned greeting exactly.
- [ ] Export or keep `formatGreeting` as a function expression (not a declaration).

## Non-functional requirements
- [ ] Pure formatter (no I/O inside `formatGreeting`)
- [ ] Separate computation (`return`) from CLI output

## Constraints
- [ ] Node.js only
- [ ] Use a **function expression** assigned to `const` — not `function formatGreeting` and not an arrow

## Acceptance criteria
- [ ] Input `Ana` → `Hello, Ana!`
- [ ] Input `Bob` → `Hello, Bob!`
- [ ] Input empty / whitespace-only → `ERROR: empty name`
- [ ] `formatGreeting` is created with `const formatGreeting = function (name) { … }`

## Example data

Input:
- `Ana`

Output:
- `Hello, Ana!`

## Suggested plan (no solution)
1. Assign `formatGreeting` with a function expression and explicit `return`.
2. Read and trim stdin.
3. Validate empty name; otherwise call and print.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept an optional greeting word as a second parameter (still as an expression).
