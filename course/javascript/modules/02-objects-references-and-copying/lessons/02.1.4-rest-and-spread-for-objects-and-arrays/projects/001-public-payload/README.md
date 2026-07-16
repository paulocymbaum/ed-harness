# Public Payload

## Problem context
Before logging or returning a user record, sensitive fields must be stripped and safe defaults applied — without mutating the original object. Rest + spread are the everyday tools for that shallow transform.

## Goal
Read one JSON object from stdin. Drop `password` and `secret` via rest, then merge `{ role: "user" }` defaults via spread (input wins over defaults for other keys). Print the public payload. Detect mutation of the original.

## Lesson concepts practiced
- [ ] Object rest gathers leftover keys after pulling some out
- [ ] Object spread shallow-copies / overrides; later keys win
- [ ] Spread is shallow — do not claim deep clone

## Functional requirements
- [ ] Read one JSON object from stdin
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON → `ERROR: invalid JSON`
- [ ] Not a plain object → `ERROR: input must be a JSON object`
- [ ] Build public object: start from defaults `{ role: "user" }`, spread input fields, but never include `password` or `secret`
- [ ] Prefer rest to drop sensitive keys (do not `delete` on the input)
- [ ] If input JSON stringifies differently after processing → `ERROR: input was mutated`
- [ ] Success → one JSON line of the public payload

## Non-functional requirements
- [ ] Do not mutate input
- [ ] Stable error strings
- [ ] Deterministic output

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Shallow only (nested objects may still be shared — that is OK for this lesson)

## Acceptance criteria
- [ ] Rest drops `password` / `secret`; leftover keys become the public fields
- [ ] Spread merge: later keys win so input `role` overrides default `"user"`
- [ ] Result is a new shallow object; nested references may still be shared — input itself is not mutated
- [ ] Empty stdin / invalid JSON error paths work
- [ ] Mutating input fails the mutation check

## Example data (if applicable)

Input:

```json
{"name":"Ada","password":"x","secret":"y"}
```

Output:

```json
{"role":"user","name":"Ada"}
```

## Suggested plan (no solution)
1. Parse and snapshot `JSON.stringify(input)`.
2. `const { password, secret, ...rest } = input`.
3. `const publicPayload = { role: "user", ...rest }`.
4. Compare snapshot; print error or JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also drop any key starting with `_`
