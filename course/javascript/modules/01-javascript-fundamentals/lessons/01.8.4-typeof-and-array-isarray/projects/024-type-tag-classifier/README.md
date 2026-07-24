# Type Tag Classifier

## Problem context

API payloads mix primitives, `null`, arrays, and plain objects. A logging helper must print a reliable type tag for each value — without treating `null` or arrays as ordinary objects.

## Goal

Read one JSON value from stdin and print a single type tag using the lesson’s safe-check order: `null` → `Array.isArray` → `typeof`.

## Lesson concepts practiced
- [ ] `typeof null === "object"` is a quirk — detect null with `=== null`
- [ ] `typeof [] === "object"` — use `Array.isArray` for arrays
- [ ] Array-like objects are not arrays
- [ ] `typeof` returns a string tag for primitives and functions

## Functional requirements
- [ ] Read one line from stdin and parse it as JSON → `value`
- [ ] Print exactly one of: `null`, `array`, or the `typeof` string (`number`, `string`, `boolean`, `object`, …)
- [ ] Use this order: if `value === null` → `null`; else if `Array.isArray(value)` → `array`; else → `typeof value`
- [ ] Do **not** use `typeof value === "object"` alone to decide “object vs array vs null”

## Non-functional requirements
- [ ] Readability: small helper (e.g. `describe(value)`) preferred
- [ ] Error handling: invalid JSON may throw (no special requirement)
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Input is one JSON line (e.g. `null`, `[]`, `{}`, `42`, `"hi"`, `true`)
- [ ] Do not invent tags like `"list"` — use `array` only via `Array.isArray`

## Acceptance criteria
- [ ] Input `null` → stdout `null`
- [ ] Input `[]` → stdout `array`
- [ ] Input `[1,2]` → stdout `array`
- [ ] Input `{}` → stdout `object`
- [ ] Input `{"length":2}` → stdout `object` (array-like is not an array)
- [ ] Input `42` → stdout `number`
- [ ] Input `"hi"` → stdout `string`
- [ ] Input `true` → stdout `boolean`

## Example data

Input:
```text
null
```

Output:
```text
null
```

Input:
```text
[]
```

Output:
```text
array
```

Input:
```text
{"length":2}
```

Output:
```text
object
```

## Suggested plan (no solution)
1. Read one stdin line and `JSON.parse` it.
2. Implement `describe(value)` with null → array → typeof order.
3. Print the tag plus a newline.
4. Mentally check the pitfall cases: `null`, `[]`, `{ length: 2 }`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept multiple JSON lines and print one tag per line
- [ ] Add a `function` demo path when stdin is the word `demo` (hardcoded `Number`)
