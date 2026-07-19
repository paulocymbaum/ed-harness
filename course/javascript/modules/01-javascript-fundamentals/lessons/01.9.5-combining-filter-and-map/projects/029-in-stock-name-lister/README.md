# In Stock Name Lister

## Problem context

An inventory CLI lists names of products that are in stock. Chain **`filter` then `map`** with named helpers.

## Goal

Read product rows from stdin, keep in-stock items, map to names, print one name per line.

## Lesson concepts practiced

- [ ] Filter-then-map order: keep before transform
- [ ] Named `isInStock` and `toName` helpers
- [ ] Empty keep set → empty stdout

## Functional requirements

- [ ] Stdin: line 1 = count `n`, then `n` lines of `name inStock` where `inStock` is exactly `true` or `false` (space-separated; name has no spaces).
- [ ] Invalid `n` → `ERROR: invalid count`.
- [ ] A row that does not end with `true`/`false` → `ERROR: invalid row`.
- [ ] Build objects `{ name, inStock }` with `inStock` boolean.
- [ ] `products.filter(isInStock).map(toName)` — must use both methods.
- [ ] Print each name on its own line.

## Non-functional requirements

- [ ] Do not mutate the products array
- [ ] Keep helpers free of I/O (`console.log` only in `main`)

## Constraints

- [ ] Node.js only
- [ ] Must chain `filter` then `map`

## Acceptance criteria

- [ ] Sample →
  ```text
  Notebook
  Pen
  USB
  ```

## Example data

Input:
```text
5
Notebook true
Pen true
Monitor false
USB true
Sticker false
```

Output:
```text
Notebook
Pen
USB
```

Input:
```text
1
Ghost false
```

Output:
```text
```

## Suggested plan (no solution)

1. Parse rows into objects.
2. Write `isInStock` / `toName`.
3. Chain and print.

## Deliverables

- [ ] Code in `starter/` (`index.js`, `tests.json`, `sample.input`)
- [ ] (Optional) `solution/`

## Extensions (optional)

- [ ] Uppercase names with a second `.map`
