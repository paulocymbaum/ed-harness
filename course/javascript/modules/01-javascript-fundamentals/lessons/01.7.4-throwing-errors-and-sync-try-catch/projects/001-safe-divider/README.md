# Safe Divider

## Problem context

CLI scripts often divide values from stdin. Returning `Infinity` or `NaN` hides bugs. A helper that **throws** on bad input, plus a `try`/`catch` in `main`, keeps failures visible and recoverable.

## Goal

Implement `divide(a, b)` that throws on division by zero, validate stdin numbers in `main`, and print either a labeled result or an `ERROR:` line from `err.message`.

## Lesson concepts practiced

- [ ] `throw new Error("…")` signals failure; `return` signals a normal result.
- [ ] After a throw inside `try`, the rest of that `try` block is skipped.
- [ ] `catch (err)` receives the thrown value — use `err.message` for the text.

## Functional requirements

- [ ] Implement `function divide(a, b)` that **returns** `a / b` (no `console.log` inside).
- [ ] If `b === 0`, throw `new Error("Cannot divide by zero")`.
- [ ] Read two lines from stdin: `a` then `b`.
- [ ] If either value is not a finite number (`Number` + `Number.isFinite`), throw `new Error("Invalid number")`.
- [ ] Call `divide` inside a `try` / `catch`.
- [ ] On success, print `Result: <quotient>`.
- [ ] On failure, print `ERROR: <err.message>` (do not crash the process).

## Non-functional requirements

- [ ] Separate computation (`divide` returns or throws) from I/O (`console.log` / `process.stdout.write` in `main`)
- [ ] Prefer `new Error("…")` over throwing bare strings
- [ ] Catch at the level that can print a clear message

## Constraints

- [ ] Node.js only
- [ ] No external libraries
- [ ] `divide` must be reusable — caller decides how to report errors

## Acceptance criteria

- [ ] `10` / `2` → `Result: 5`
- [ ] `9` / `3` → `Result: 3`
- [ ] `10` / `0` → `ERROR: Cannot divide by zero`
- [ ] `x` / `2` → `ERROR: Invalid number`

## Example data

Input:

- `10`
- `2`

Output:

- `Result: 5`

## Suggested plan (no solution)

1. Write `divide` with a zero check that throws `Error`.
2. Read two stdin lines and parse with `Number`.
3. Wrap validation + `divide` in `try` / `catch`.
4. Print `Result:` or `ERROR:` using `err.message`.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)

- [ ] Add `finally` that always prints `done` after each run.
- [ ] Support a third “mode” line: `floor` to print `Math.floor` of the quotient.
