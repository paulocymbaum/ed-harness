# Entries Transform

## Problem context
Sanitizing records often means “map or filter the pairs, then rebuild the object.” `Object.entries` + `Object.fromEntries` is the standard pipeline.

## Goal
Read one JSON object from stdin. Drop keys `password` and `secret`, double every numeric value, leave other values unchanged, and rebuild with `fromEntries`. Print the result.

## Lesson concepts practiced
- [ ] `Object.fromEntries` is the inverse of `Object.entries`
- [ ] Filter/map pairs, then rebuild
- [ ] Duplicate keys: last pair wins (avoid creating dupes here)

## Functional requirements
- [ ] Read one JSON object from stdin
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON → `ERROR: invalid JSON`
- [ ] Not a plain object → `ERROR: input must be a JSON object`
- [ ] Remove keys named `password` or `secret`
- [ ] For remaining pairs: if `typeof value === "number"` and `Number.isFinite(value)`, replace with `value * 2`
- [ ] Rebuild via `Object.fromEntries` after `Object.entries` + `filter`/`map`
- [ ] Success → one JSON line
- [ ] Do not mutate the input object

## Non-functional requirements
- [ ] Stable error strings
- [ ] Deterministic output

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Must use `entries` → transform → `fromEntries` (not ad-hoc `for...in` rebuild alone)

## Acceptance criteria
- [ ] Numbers doubled; sensitive keys dropped
- [ ] Non-numeric values unchanged
- [ ] Empty / invalid JSON paths work

## Example data (if applicable)

Input:

```json
{"name":"Ada","score":10,"password":"x","bonus":3}
```

Output:

```json
{"name":"Ada","score":20,"bonus":6}
```

## Suggested plan (no solution)
1. Parse and validate.
2. `Object.entries(input).filter(...).map(...)`.
3. `Object.fromEntries(pairs)` and print.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also coerce numeric strings before doubling
