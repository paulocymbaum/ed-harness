# Unique Tag Builder

## Problem context

A tagging tool collapses duplicate labels while keeping first-seen order. Use a **`Set`** with **`for...of`** — no spread required.

## Goal

Read tags from stdin, print each unique tag once in first-seen order, then print how many unique tags there are.

## Lesson concepts practiced

- [ ] `new Set` / `.has` / `.add` (or walking `new Set(arr)`)
- [ ] `for...of` over a Set yields uniques
- [ ] Append uniques into a plain array without spread

## Functional requirements

- [ ] Stdin: line 1 = count `n`, then `n` tag lines (keep text as-is after stripping only the trailing newline from readline).
- [ ] Invalid `n` → `ERROR: invalid count`.
- [ ] Build uniqueness with `Set` (constructor from the tags array **or** incremental `.add` / `.has`).
- [ ] Print each unique tag on its own line (first-seen order).
- [ ] Print the unique count on a final line.
- [ ] Do **not** use spread (`...`) to convert the Set.
- [ ] `n === 0` → print only `0`.

## Non-functional requirements

- [ ] Prefer clear Set usage over nested index scans with `includes`
- [ ] No extra blank lines

## Constraints

- [ ] Node.js only
- [ ] Must use `Set`
- [ ] No `filter`/`map` required (allowed only if you still use Set for uniqueness)

## Acceptance criteria

- [ ] Sample →
  ```text
  js
  node
  cli
  3
  ```

## Example data

Input:
```text
4
js
node
js
cli
```

Output:
```text
js
node
cli
3
```

Input:
```text
0
```

Output:
```text
0
```

## Suggested plan (no solution)

1. Read tags into an array.
2. `for...of` over `new Set(tags)` (or manual has/add) into `unique`.
3. Print tags then `unique.length`.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] Skip empty-string tags
