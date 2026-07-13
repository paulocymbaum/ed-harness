# Line Pipeline

## Problem context

A text-processing tool reads a batch of lines and applies one of two simple transformations selected by an operation name: uppercase every line, or drop the blank ones. Both are classic one-liners with `map`/`filter`.

## Goal

Read an operation name and a batch of lines from stdin. If the operation is `upper`, print every line uppercased. If the operation is `nonempty`, print only the lines that are not empty.

## Lesson concepts practiced
- [ ] `map` transforms every element and returns a new array of the same length
- [ ] `filter` keeps only elements passing a predicate and may return a shorter array
- [ ] Neither `map` nor `filter` mutates the original array
- [ ] Higher-order functions receive a callback describing *what* to do per element

## Functional requirements
- [ ] Read the first stdin line as the operation: `upper` or `nonempty`
- [ ] Read every remaining line (until EOF) as the input batch
- [ ] If operation is `upper`, transform the batch with `.map()` to uppercase each line
- [ ] If operation is `nonempty`, transform the batch with `.filter()` to keep only lines with length greater than 0
- [ ] Print the resulting lines, one per line, in original order
- [ ] If the resulting batch is empty, print nothing (no trailing blank line)

## Non-functional requirements
- [ ] Readability: implement `mapUpper(lines)` and `filterNonEmpty(lines)` as small named functions
- [ ] Error handling: an unknown operation may throw (no special requirement)
- [ ] Output has exactly one line per surviving/transformed element, each ending with a newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Use `Array.prototype.map` / `Array.prototype.filter` — do not use a manual `for` loop with `push`
- [ ] Do not mutate the input array of lines

## Acceptance criteria
- [ ] Operation `upper` on batch `abc`, `def` → stdout `ABC` then `DEF`
- [ ] Operation `nonempty` on batch `a`, ``, `b` → stdout `a` then `b`
- [ ] Operation `nonempty` on batch ``, `` → stdout nothing (empty output)
- [ ] Operation `upper` on batch `Already Upper` → stdout `ALREADY UPPER`
- [ ] Line order is preserved in both operations

## Example data

Input:
```text
upper
abc
def
```

Output:
```text
ABC
DEF
```

Input:
```text
nonempty
a

b
```

Output:
```text
a
b
```

## Suggested plan (no solution)
1. Read all stdin lines; the first line is the operation, the rest are the batch.
2. Implement `mapUpper(lines)` using `.map()` and `filterNonEmpty(lines)` using `.filter()`.
3. Pick the transformation based on the operation name.
4. Join the resulting lines with `\n` and print (skip the trailing newline if the result is empty).

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `trim` operation that trims each line with `.map((l) => l.trim())`
- [ ] Support chaining multiple operations from a comma-separated first line (e.g. `nonempty,upper`)
