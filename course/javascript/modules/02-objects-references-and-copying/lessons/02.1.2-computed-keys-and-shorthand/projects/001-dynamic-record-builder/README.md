# Dynamic Record Builder

## Problem context
Log lines and form posts often arrive as `key=value` pairs. You need to assemble a plain object where each key comes from input — classic computed-key territory.

## Goal
Read `key=value` lines from stdin and build one JSON object using computed keys. Print the object as one JSON line.

## Lesson concepts practiced
- [ ] Computed keys `{ [expr]: value }` decide the property name at creation time
- [ ] Shorthand is for when the variable name already matches the key you want
- [ ] `{ key: value }` is NOT the same as `{ [key]: value }` when `key` is a variable

## Functional requirements
- [ ] Each non-empty stdin line is `key=value` (split on the first `=`)
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Line without `=` → `ERROR: invalid pair`
- [ ] Empty key (before `=`) → `ERROR: empty key`
- [ ] Duplicate keys: last line wins
- [ ] Success → `JSON.stringify(record)` on one line

## Non-functional requirements
- [ ] Build with object literals / computed keys (not `Object.defineProperty`)
- [ ] Stable error messages
- [ ] Deterministic key order = insertion order of first-seen then overwrite value

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Values stay strings (do not coerce types)

## Acceptance criteria
- [ ] `name=Ada\nage=36` → `{"name":"Ada","age":"36"}`
- [ ] Duplicate key keeps last value
- [ ] Empty stdin → `ERROR: missing input`
- [ ] `noequals` → `ERROR: invalid pair`

## Example data (if applicable)

Input:

```text
name=Ada
role=admin
```

Output:

```text
{"name":"Ada","role":"admin"}
```

## Suggested plan (no solution)
1. Read lines; fail if none.
2. For each line, split on first `=`; validate key.
3. Assign with computed key into a growing object: `record[key] = value` or `{ ...record, [key]: value }`.
4. Print JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also accept a final shorthand demo field via a fixed variable name
