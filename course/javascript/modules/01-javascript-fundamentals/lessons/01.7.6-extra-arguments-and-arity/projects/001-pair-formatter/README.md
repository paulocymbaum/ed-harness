# Pair Formatter

## Problem context
Log lines often carry more tokens than a helper needs. Your pair formatter declares only two parameters — any extras on the call must be ignored without error.

## Goal
Implement `formatPair(a, b)`, read space-separated tokens from one stdin line, call the helper with **all** tokens spread as arguments, and print only the formatted pair (extras discarded by arity).

## Lesson concepts practiced
- [ ] Extra arguments do **not** cause an error — they are ignored by named parameters.
- [ ] Match arguments to parameters left to right.
- [ ] Missing arguments are `undefined` (see `01.7.2`).

## Functional requirements
- [ ] Implement `function formatPair(a, b)` that **returns** `a + "|" + b` (no printing inside).
- [ ] Read one line from stdin; split on whitespace into tokens.
- [ ] Fewer than 2 tokens → `ERROR: need two tokens`.
- [ ] Call `formatPair(...tokens)` so any tokens beyond the second are passed but ignored.
- [ ] Print the returned string on success.

## Non-functional requirements
- [ ] Pure helper (`return` only)
- [ ] Demonstrate extras by spreading all tokens into the call

## Constraints
- [ ] Node.js only
- [ ] Do not slice tokens before the call — pass extras so the function ignores them

## Acceptance criteria
- [ ] Input `x y` → `x|y`
- [ ] Input `x y z w` → `x|y` (extras ignored)
- [ ] Input `only` → `ERROR: need two tokens`
- [ ] Input empty → `ERROR: need two tokens`

## Example data

Input:
- `alpha beta gamma`

Output:
- `alpha|beta`

## Suggested plan (no solution)
1. Write `formatPair` with two parameters.
2. Split the stdin line into tokens.
3. Guard length < 2; then `formatPair(...tokens)` and print.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print `formatPair.length` on a debug line to show declared arity.
