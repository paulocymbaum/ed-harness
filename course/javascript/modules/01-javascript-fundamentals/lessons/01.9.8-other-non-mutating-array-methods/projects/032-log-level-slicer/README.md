# Log Level Slicer

## Problem context

A logger config tool copies a middle band of levels and reports whether `"error"` exists — without mutating the master list. Use **`slice`**, **`includes`**, and **`join`**.

## Goal

Read four level names, copy a half-open slice, check membership on the original, and print three lines of results.

## Lesson concepts practiced

- [ ] `slice(start, end)` end is exclusive; original unchanged
- [ ] `includes` for yes/no membership
- [ ] `join` builds a display string from an array

## Functional requirements

- [ ] Stdin: exactly 4 lines — the log levels in order (e.g. error, warn, info, debug).
- [ ] Keep them in `levels` as a 4-element array.
- [ ] `mid = levels.slice(1, 3)` (middle two).
- [ ] Print `String(levels.includes("error"))` (`"true"` / `"false"`).
- [ ] Print `mid.join(" | ")`.
- [ ] Print `levels.join(",")` to prove the original is intact (still four levels).
- [ ] Do **not** use `splice`, `push`, `filter`, or `map`.

## Non-functional requirements

- [ ] Non-mutating methods only for list ops in this project
- [ ] Exact stdout formatting as examples

## Constraints

- [ ] Node.js only
- [ ] Must use `slice`, `includes`, and `join`

## Acceptance criteria

- [ ] Sample →
  ```text
  true
  warn | info
  error,warn,info,debug
  ```

## Example data

Input:
```text
error
warn
info
debug
```

Output:
```text
true
warn | info
error,warn,info,debug
```

Input:
```text
ok
warn
info
trace
```

Output:
```text
false
warn | info
ok,warn,info,trace
```

## Suggested plan (no solution)

1. Read four lines into `levels`.
2. Slice middle two.
3. Print includes / join(mid) / join(levels).

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] Also print `indexOf("warn")` on a fourth line
