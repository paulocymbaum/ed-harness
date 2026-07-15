# Safe Normalizer

## Problem context
Inbound user payloads often need cleanup (trim, coerce types, drop empty tags). A common bug: normalizing **mutates** the original object because objects are shared by reference — later code sees corrupted input or shared nested objects.

## Goal
Implement `normalize(input)` that returns a **new** cleaned object and never mutates `input` (nor nested `profile` / `meta` / `tags`). Wire a CLI that reads one JSON object from stdin, normalizes it, rejects mutation, and prints one JSON line — or `ERROR: <message>`.

## Lesson concepts practiced
- [ ] Objects alias by reference — mutating nested fields changes the caller's object
- [ ] Reassignment / returning a new object leaves the original intact
- [ ] Primitives copy by value; nested objects need new containers, not in-place edits

## Functional requirements
- [ ] Read one JSON object from stdin (full body, trimmed)
- [ ] On empty stdin: `ERROR: missing input`
- [ ] On invalid JSON: `ERROR: invalid JSON`
- [ ] `normalize(input)` returns a new object with:
  - [ ] `userId`: integer (`Number` + `Number.isInteger` / `Number.isFinite`); else throw `userId must be an integer`
  - [ ] `tags`: array of non-empty strings, trimmed and lowercased (drop null/empty); else throw `tags must be an array`
  - [ ] `profile.name`: trimmed non-empty string; else throw `profile.name is required`
  - [ ] `profile.age`: integer, or `null` if missing/blank; else throw `profile.age must be an integer`
  - [ ] `meta.receivedAt`: non-empty string; else throw `meta.receivedAt is required`
  - [ ] `meta.source`: exactly one of `cli`, `api`, `file`; else throw `meta.source must be one of: cli, api, file`
- [ ] `input`, `input.profile`, `input.meta`, and `input.tags` must be plain objects/array as required; else throw `<name> must be an object` (or tags error above)
- [ ] Before/after: if `JSON.stringify(input)` changed, print `ERROR: input was mutated` (do not print normalized output)
- [ ] Success: print exactly one line — `JSON.stringify(normalized)`
- [ ] Validation failures: print `ERROR: <message>` (thrown message)

## Non-functional requirements
- [ ] Do not mutate `input` or any nested object/array from the input
- [ ] Build the result with new object/array literals (no in-place `push`/`sort` on `input.tags`)
- [ ] Clear, stable error strings matching the messages above

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Single JSON object on stdin (not line protocol)

## Acceptance criteria
- [ ] Valid payload → cleaned JSON on one line; original input unchanged
- [ ] Tags trimmed/lowercased; empty/null tags dropped
- [ ] `profile.name` trim; `userId`/`age` coerced to integers when valid
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON → `ERROR: invalid JSON`
- [ ] Missing/blank name → `ERROR: profile.name is required`
- [ ] Bad `meta.source` → `ERROR: meta.source must be one of: cli, api, file`
- [ ] Any in-place mutation of input → `ERROR: input was mutated`

## Example data (if applicable)

Input:

```json
{"userId":"42","tags":["  A ",null,"","B"],"profile":{"name":" Ana ","age":"20"},"meta":{"receivedAt":"2020-01-01T00:00:00.000Z","source":"api"}}
```

Output:

```json
{"userId":42,"tags":["a","b"],"profile":{"name":"Ana","age":20},"meta":{"receivedAt":"2020-01-01T00:00:00.000Z","source":"api"}}
```

## Suggested plan (no solution)
1. Parse stdin; fail fast on empty / invalid JSON.
2. Snapshot `JSON.stringify(input)` before calling `normalize`.
3. Implement helpers that return new values (numbers, new `tags` array, new `profile` / `meta` objects).
4. Assemble and return a new top-level object — never assign into `input.*`.
5. Compare snapshot after normalize; print error if mutated, else print JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Deep-freeze the input after parse and catch mutations via thrown errors instead of stringify compare
- [ ] Add a primitive field copy demo asserting number reassignment does not affect a stored original
