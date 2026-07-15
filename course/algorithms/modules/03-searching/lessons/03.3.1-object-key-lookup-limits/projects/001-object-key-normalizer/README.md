# Object Key Normalizer

## Problem context
Before switching to `Map`, you should see how plain objects normalize keys. Interview debugging often starts with "why did these two keys collide?"

## Goal
Read a key kind and optional raw value; print how a plain object would store that key as `string:<ToString>`.

## Lesson concepts practiced
- [ ] Object keys are strings (or symbols)
- [ ] Numeric-looking keys coerce to strings
- [ ] Objects are a poor map for non-string identities

## Functional requirements
- [ ] Line 1: `number <n>` | `string <s>` | `boolean true|false` | `object`
- [ ] For `object`, pretend the key is `{}`
- [ ] Print `string:` + the coerced property name

## Non-functional requirements
- [ ] Deterministic string output
- [ ] No external libraries

## Constraints
- [ ] Node.js only
- [ ] Read stdin lines as described

## Acceptance criteria
- [ ] `number 1` → `string:1`
- [ ] `string 1` → `string:1`
- [ ] `boolean true` → `string:true`
- [ ] `object` → `string:[object Object]`

## Example data

Input:
- `number 1`

Output:
- `string:1`

## Suggested plan (no solution)
1. Parse the kind token.
2. Build the value that would be used as a key.
3. Print `string:` + `String(key)` (object → `[object Object]`).

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a `symbol` kind that prints `symbol` (not stringified into Object.keys).
