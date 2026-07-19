# Passing Score Keeper

## Problem context

A grading helper keeps only scores at or above a threshold. Use **`filter`** with a named predicate — no hand-built keep loop.

## Goal

Read a threshold and scores from stdin, keep passing scores with `filter`, print each kept score on its own line.

## Lesson concepts practiced

- [ ] `filter` returns a **new** array; original scores stay intact
- [ ] Named predicate callback (truthy keep rule)
- [ ] Empty filter result → empty stdout (no error)

## Functional requirements

- [ ] Stdin: line 1 = `threshold`, line 2 = count `n`, then `n` score lines.
- [ ] Parse with `Number`. Non-finite → print `ERROR: invalid number` and stop.
- [ ] If `n` is not a finite number `>= 0` → print `ERROR: invalid count` and stop.
- [ ] Define `isPassing(score)` (named function or named arrow) that returns whether `score >= threshold`.
- [ ] Use `scores.filter(isPassing)` — do not rebuild with a manual keep loop.
- [ ] Print each passing score on its own line (same numeric formatting as input numbers via `String(score)` or default print).
- [ ] If none pass, print nothing.

## Non-functional requirements

- [ ] Do not mutate the `scores` array
- [ ] Keep parsing separate from filtering

## Constraints

- [ ] Node.js only
- [ ] Must call `Array.prototype.filter`
- [ ] Do not use `map` in this project

## Acceptance criteria

- [ ] Sample → stdout:
  ```text
  72
  91
  ```
- [ ] All below threshold → empty stdout

## Example data

Input:
```text
60
4
40
72
91
55
```

Output:
```text
72
91
```

Input:
```text
100
2
40
70
```

Output:
```text
```

## Suggested plan (no solution)

1. Parse threshold, `n`, and scores.
2. Write `isPassing`.
3. `const passing = scores.filter(isPassing)`.
4. Print each entry.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] Also print how many passed on a trailing line
