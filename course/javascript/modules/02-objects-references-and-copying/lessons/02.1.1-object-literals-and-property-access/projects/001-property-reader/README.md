# Property Reader

## Problem context
APIs and configs often arrive as JSON objects. You need a tiny CLI that looks up one property by name using bracket access (the key comes from input, so dot notation cannot work).

## Goal
Read a JSON object and a property key from stdin. Print the property value as JSON, or a clear error if the key is missing / input is invalid.

## Lesson concepts practiced
- [ ] Bracket notation is required when the key comes from a variable
- [ ] Missing keys return `undefined` — treat that as a lookup miss
- [ ] Dot vs bracket: `obj.key` looks for a literal name `"key"`

## Functional requirements
- [ ] Stdin has two lines: (1) a JSON object, (2) a property key string
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Invalid JSON on line 1 → `ERROR: invalid JSON`
- [ ] Line 1 not a plain object → `ERROR: input must be a JSON object`
- [ ] Missing/blank key on line 2 → `ERROR: missing key`
- [ ] Key not present (`undefined`) → `ERROR: key not found`
- [ ] Success → print `JSON.stringify(value)` on one line (including `null` if the stored value is `null`)

## Non-functional requirements
- [ ] Do not mutate the input object
- [ ] Stable error strings matching the messages above
- [ ] Deterministic output

## Constraints
- [ ] Node.js only
- [ ] No external libraries
- [ ] Use bracket access with the key from stdin (not hard-coded dots)

## Acceptance criteria
- [ ] `{"name":"Ada"}\nname` → `"Ada"`
- [ ] `{"age":36}\nage` → `36`
- [ ] `{"x":null}\nx` → `null`
- [ ] Missing key → `ERROR: key not found`
- [ ] Empty stdin → `ERROR: missing input`
- [ ] Bad JSON → `ERROR: invalid JSON`

## Example data (if applicable)

Input:

```text
{"name":"Ada","age":36}
name
```

Output:

```text
"Ada"
```

## Suggested plan (no solution)
1. Read stdin; split into lines; fail fast on empty / bad JSON.
2. Parse the object; validate it is a plain object.
3. Read the key from line 2; look up with `obj[key]`.
4. If the value is `undefined`, print key-not-found; else stringify the value.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support dotted paths like `profile.name` with successive bracket lookups
