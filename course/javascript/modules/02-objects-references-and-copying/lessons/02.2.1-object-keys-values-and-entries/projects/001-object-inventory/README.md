# Object Inventory

## Problem context
Debugging and serialization pipelines often need a quick inventory of an object's keys, values, and entry pairs — exactly what `Object.keys` / `values` / `entries` provide.

## Goal
Read one JSON object from stdin. Print a JSON object `{ keys, values, entries }` built with those three static methods.

## Lesson concepts practiced
- [ ] `Object.keys` / `values` / `entries` turn an object into arrays
- [ ] These methods list own enumerable string keys only
- [ ] The returned arrays are new — mutating them does not change the object

## Functional requirements
- [ ] Read one JSON object from stdin
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON → `ERROR: invalid JSON`
- [ ] Not a plain object → `ERROR: input must be a JSON object`
- [ ] Success → `{"keys":[...],"values":[...],"entries":[[k,v],...]}` one line
- [ ] Use `Object.keys`, `Object.values`, and `Object.entries` (do not hand-roll key lists)

## Non-functional requirements
- [ ] Do not mutate the input
- [ ] Stable error strings
- [ ] Deterministic output (engine key order)

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `{"name":"Ada","age":36}` → keys/values/entries match
- [ ] `{}` → empty arrays
- [ ] Empty / invalid JSON error paths work

## Example data (if applicable)

Input:

```json
{"name":"Ada","age":36}
```

Output:

```json
{"keys":["name","age"],"values":["Ada",36],"entries":[["name","Ada"],["age",36]]}
```

## Suggested plan (no solution)
1. Parse and validate plain object.
2. Build `{ keys: Object.keys(obj), values: Object.values(obj), entries: Object.entries(obj) }`.
3. Print JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Sort keys alphabetically before building inventory (re-map entries accordingly)
