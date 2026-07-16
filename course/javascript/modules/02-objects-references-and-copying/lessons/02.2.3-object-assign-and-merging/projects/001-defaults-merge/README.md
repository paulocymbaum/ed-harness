# Defaults Merge

## Problem context
CLI tools often merge a defaults object with user overrides. `Object.assign({}, defaults, overrides)` (or equivalent spread) creates a new shallow merge without mutating either source.

## Goal
Read two JSON objects from stdin (defaults on line 1, overrides on line 2). Merge into a **new** object. Print the merge. Fail if either source was mutated.

## Lesson concepts practiced
- [ ] `Object.assign` copies onto a target; pass `{}` for a new object
- [ ] Later sources win on key conflicts
- [ ] Merge is shallow — nested objects are replaced, not deep-merged

## Functional requirements
- [ ] Stdin: line 1 = defaults JSON object, line 2 = overrides JSON object
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Either line invalid JSON → `ERROR: invalid JSON`
- [ ] Either line not a plain object → `ERROR: input must be a JSON object`
- [ ] Missing line 2 → `ERROR: missing overrides`
- [ ] Merge with `Object.assign({}, defaults, overrides)` or `{ ...defaults, ...overrides }`
- [ ] If either source stringifies differently after merge → `ERROR: input was mutated`
- [ ] Success → one JSON line of the merged object

## Non-functional requirements
- [ ] Never use the defaults object as the assign target
- [ ] Stable error strings
- [ ] Deterministic output

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Shallow merge only

## Acceptance criteria
- [ ] Overrides win on conflicts; defaults fill missing keys
- [ ] Sources unchanged
- [ ] Empty / invalid / missing-overrides errors work

## Example data (if applicable)

Input:

```text
{"theme":"light","lang":"en"}
{"lang":"pt"}
```

Output:

```text
{"theme":"light","lang":"pt"}
```

## Suggested plan (no solution)
1. Split stdin into two lines; parse both.
2. Snapshot both with `JSON.stringify`.
3. `const merged = Object.assign({}, defaults, overrides)`.
4. Verify snapshots; print merged JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Reject when a nested object key would be shallow-replaced (warn about deep-merge needs)
