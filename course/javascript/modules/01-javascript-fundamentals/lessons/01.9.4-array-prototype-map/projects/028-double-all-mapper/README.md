# Double All Mapper

## Problem context

A scaling tool doubles every measurement before export. Use **`map`** with a named `double` helper — one output per input.

## Goal

Read numbers from stdin, double each with `map`, print each result on its own line.

## Lesson concepts practiced

- [ ] `map` returns a **new** array of the **same length**
- [ ] Named transform helper passed to `map`
- [ ] Block-body arrows need `return`; prefer expression body for `double`

## Functional requirements

- [ ] Stdin: line 1 = count `n`, then `n` number lines.
- [ ] Non-finite `n` or `n < 0` → `ERROR: invalid count`.
- [ ] Non-finite value → `ERROR: invalid number`.
- [ ] Define named `double(n)` returning `n * 2`.
- [ ] Use `nums.map(double)` — no manual rebuild loop for the transform.
- [ ] Print each doubled value on its own line.
- [ ] `n === 0` → empty stdout.

## Non-functional requirements

- [ ] Do not mutate the input numbers array
- [ ] Do not use `filter` in this project

## Constraints

- [ ] Node.js only
- [ ] Must use `Array.prototype.map`

## Acceptance criteria

- [ ] Sample →
  ```text
  2
  4
  6
  ```

## Example data

Input:
```text
3
1
2
3
```

Output:
```text
2
4
6
```

Input:
```text
0
```

Output:
```text
```

## Suggested plan (no solution)

1. Parse `n` and numbers.
2. Write `double`.
3. Map and print.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] Accept a scale factor on line 1 instead of always ×2
