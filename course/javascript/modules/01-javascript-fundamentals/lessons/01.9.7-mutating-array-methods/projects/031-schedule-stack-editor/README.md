# Schedule Stack Editor

## Problem context

A schedule board edits a day list **in place** with stack-style mutations. Practice **`push`**, **`unshift`**, and **`splice`**.

## Goal

Start from two mid-week days, apply a fixed mutation recipe from stdin seeds, and print the final array joined by spaces plus the length.

## Lesson concepts practiced

- [ ] `unshift` / `push` mutate the same array
- [ ] `splice` can replace a middle slot
- [ ] Shared array identity — mutations are visible on the original variable

## Functional requirements

- [ ] Stdin: exactly 3 lines — `front`, `end`, `middleReplace`.
- [ ] Start with `days = ["Tue", "Wed"]` (literal — ignore none of these).
- [ ] `days.unshift(front)`.
- [ ] `days.push(end)`.
- [ ] Find `"Wed"` with a small index `for` (do not use `indexOf` yet) and `splice(index, 1, middleReplace)` to replace it.
- [ ] Print the days separated by single spaces (build the string with a loop — `join` comes in `01.9.8`), then print `days.length` on the next line.
- [ ] Do **not** rebuild a new array with literals after starting — mutate `days`.

## Non-functional requirements

- [ ] Keep steps in the order above
- [ ] No `filter` / `map`

## Constraints

- [ ] Node.js only
- [ ] Must use `unshift`, `push`, and `splice`

## Acceptance criteria

- [ ] Sample →
  ```text
  Mon Tue WedX Thu
  4
  ```

## Example data

Input:
```text
Mon
Thu
WedX
```

Output:
```text
Mon Tue WedX Thu
4
```

Input:
```text
Sun
Fri
WedX
```

Output:
```text
Sun Tue WedX Fri
4
```

## Suggested plan (no solution)

1. Read three lines.
2. Seed `["Tue", "Wed"]`.
3. `unshift` → `push` → `splice` replace `"Wed"`.
4. Print join + length.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] `pop` the last day and print it on a third line
