# Config Unpacker

## Problem context
Services often receive a fat config object when you only need a few fields with defaults. Destructuring keeps the unpack step readable and safe when keys are missing.

## Goal
Read one JSON config from stdin. Unpack `host`, `port`, and optional `env` (default `"development"`) using object destructuring. Print a compact JSON object `{ host, port, env }`.

## Lesson concepts practiced
- [ ] Destructuring unpacks fields into variables in one step
- [ ] Defaults apply when the value is `undefined`
- [ ] Guard null/undefined before destructuring (`?? {}`)

## Functional requirements
- [ ] Read one JSON object from stdin (full body, trimmed)
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON → `ERROR: invalid JSON`
- [ ] Not a plain object → `ERROR: input must be a JSON object`
- [ ] Missing/blank `host` (after coerce to string trim) → `ERROR: host is required`
- [ ] `port` must be an integer number (or numeric string that parses to integer) → else `ERROR: port must be an integer`
- [ ] `env` defaults to `"development"` when missing/`undefined`
- [ ] Success → `{"host":"...","port":N,"env":"..."}` one line

## Non-functional requirements
- [ ] Use destructuring (with default for `env`) in `unpackConfig`
- [ ] Do not mutate the input object
- [ ] Stable error strings

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] Full config → packed JSON with given env
- [ ] Missing env → `"development"`
- [ ] Missing host → error
- [ ] Empty stdin → `ERROR: missing input`

## Example data (if applicable)

Input:

```json
{"host":"localhost","port":3000,"debug":true}
```

Output:

```json
{"host":"localhost","port":3000,"env":"development"}
```

## Suggested plan (no solution)
1. Parse stdin; reject empty / invalid / non-object.
2. Destructure `{ host, port, env = "development" }` (after nullish guard).
3. Validate host/port; return a new object with only the three fields.
4. Print JSON.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Nested destructure of `meta: { region }` when present
