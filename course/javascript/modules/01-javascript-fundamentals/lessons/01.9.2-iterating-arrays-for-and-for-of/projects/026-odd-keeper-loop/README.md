# Odd Keeper Loop

## Problem context

A small report CLI keeps only odd readings from a sensor list. You must walk the list with **`for...of`** and build the kept array by hand — no `filter` yet.

## Goal

Read integers from stdin, keep odd values with a `for...of` loop, print each kept value, then print how many were kept.

## Lesson concepts practiced

- [ ] `for...of` yields values, not indexes
- [ ] Append with `arr[arr.length] = value` while iterating
- [ ] Stop condition is driven by the input count, not `filter`

## Functional requirements

- [ ] Read line 1 as count `n` (`Number`). Then read exactly `n` integer lines.
- [ ] If `n` is not a finite number `>= 0`, print `ERROR: invalid count` and exit.
- [ ] If any value line is not a finite number, print `ERROR: invalid number` and exit.
- [ ] Build `odds` with `for...of` over the numbers; keep values where `n % 2 !== 0` (odds include negatives like `-3`).
- [ ] Do **not** use `filter`, `map`, `push`, or `splice`.
- [ ] Print each odd on its own line, then print `odds.length` on a final line.
- [ ] If none are odd, print only `0`.

## Non-functional requirements

- [ ] Keep the keep-loop easy to read (one clear `if`)
- [ ] No extra blank lines beyond required newlines

## Constraints

- [ ] Node.js only — no external libraries
- [ ] Must use `for...of` to walk the numbers array

## Acceptance criteria

- [ ] Sample input → stdout:
  ```text
  1
  3
  5
  3
  ```
- [ ] All-even input → single line `0`

## Example data

Input:
```text
5
1
2
3
4
5
```

Output:
```text
1
3
5
3
```

Input:
```text
3
2
4
6
```

Output:
```text
0
```

## Suggested plan (no solution)

1. Read `n` and `n` numbers into an array.
2. Create empty `odds`.
3. `for...of` each number; append odds with `odds[odds.length] = …`.
4. Print each odd, then length.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)

- [ ] Also print the sum of kept odds on a last line
