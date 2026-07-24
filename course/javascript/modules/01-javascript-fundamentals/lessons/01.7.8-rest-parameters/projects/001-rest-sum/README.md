# Rest Sum

## Problem context
A tiny accounting helper must add any number of amounts without fixing the parameter list in advance. Rest parameters gather every value into one array.

## Goal
Implement `sum(...nums)`, read numbers from stdin (one per line), and print the total.

## Lesson concepts practiced
- [ ] `...name` in the parameter list collects remaining args into an array.
- [ ] Rest must be the **last** parameter.
- [ ] Zero leftovers → `[]`.

## Functional requirements
- [ ] Implement `function sum(...nums)` that returns the numeric total of all arguments (empty call → `0`).
- [ ] Read all non-empty stdin lines; each must parse as a finite number or print `ERROR: invalid number`.
- [ ] Call `sum(...values)` with the parsed numbers (including zero numbers → `sum()` → `0`).
- [ ] Print `Sum: <total>` on success (plain number, no forced decimals).

## Non-functional requirements
- [ ] Use rest parameters — do not read from a global array inside `sum`
- [ ] Pure helper (no I/O inside `sum`)

## Constraints
- [ ] Node.js only
- [ ] Rest parameter required: `function sum(...nums)`

## Acceptance criteria
- [ ] Rest gathers leftovers into an array: inputs `1` / `2` / `3` → `Sum: 6`
- [ ] Single leftover still works: input `10` → `Sum: 10`
- [ ] Zero leftovers → empty rest `[]` → `Sum: 0`
- [ ] Rest is the last (only) parameter: `function sum(...nums)`
- [ ] Any non-finite line → `ERROR: invalid number`

## Example data

Input:
- `1`
- `2`
- `3`

Output:
- `Sum: 6`

## Suggested plan (no solution)
1. Implement `sum` with a rest parameter and a loop (or reduce).
2. Parse each stdin line; fail fast on invalid numbers.
3. Call `sum(...values)` and print the labeled total.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `sumLabeled(label, ...nums)` returning `label + ":" + total`.
