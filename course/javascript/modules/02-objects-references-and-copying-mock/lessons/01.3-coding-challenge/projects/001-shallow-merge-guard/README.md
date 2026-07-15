# Shallow Merge Guard

## Problem context

Config loaders and reducers often merge a patch object onto a base object — for example, applying user settings on top of defaults. Doing this safely means never mutating the original base object.

## Goal

Implement `shallowMergeGuard(a, b)` that returns a **new** object combining `a` and `b` without mutating either input, read two JSON objects from `stdin`, and print the merged result.

## Lesson concepts practiced

- [ ] Reference vs value — objects are copied by reference, so a "copy" must build a new object rather than reassign the same one.
- [ ] Shallow copy — merge only needs to protect the top-level object; nested values may still be shared references.
- [ ] Guard against invalid input before touching the merge logic.

## Functional requirements

- [ ] Implement `function shallowMergeGuard(a, b)` that **returns** a new object (no `console.log` inside).
- [ ] The result must contain all own enumerable keys of `a`, overwritten by any same-named own enumerable keys of `b`.
- [ ] Any key present only in `b` must be added to the result.
- [ ] The original `a` object must **not** be mutated by the merge.
- [ ] Read two lines from `stdin`: line 1 is JSON object `a`, line 2 is JSON object `b`.
- [ ] If either line fails to parse as JSON → print `ERROR: invalid json`.
- [ ] Otherwise print `JSON.stringify(result)` for the merged object (one line, no `Result:` label).

## Non-functional requirements

- [ ] Separate computation (`shallowMergeGuard`) from I/O (`console.log` / `process.stdout.write`)
- [ ] Use `try`/`catch` around `JSON.parse`, not manual string checks

## Constraints

- [ ] Node.js only
- [ ] Do not mutate the parsed `a` object anywhere in the program
- [ ] Assume both lines, when valid, parse to plain JSON objects (not arrays)

## Acceptance criteria

- [ ] `{"a":1,"b":2}` / `{"b":3,"c":4}` → `{"a":1,"b":3,"c":4}`
- [ ] `{"x":1,"y":2}` / `{}` → `{"x":1,"y":2}`
- [ ] `{}` / `{"z":9}` → `{"z":9}`
- [ ] `{"a":1}` / `{"a":2,"b":3}` → `{"a":2,"b":3}`
- [ ] `{a:1}` (invalid) / `{}` → `ERROR: invalid json`
- [ ] `{"a":1}` / `{b:2}` (invalid) → `ERROR: invalid json`

## Example data

Input:

```
{"a":1,"b":2}
{"b":3,"c":4}
```

Output:

```
{"a":1,"b":3,"c":4}
```

## Suggested plan (no solution)

1. Read two lines from stdin.
2. Parse each line as JSON inside a `try`/`catch`; on failure print `ERROR: invalid json` and stop.
3. Implement `shallowMergeGuard` using a shallow copy of `a` merged with `b`'s own keys.
4. Print `JSON.stringify` of the result.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)

## Extensions (optional)

- [ ] Add a `deepMergeGuard(a, b)` that recursively merges nested plain objects instead of overwriting them.
