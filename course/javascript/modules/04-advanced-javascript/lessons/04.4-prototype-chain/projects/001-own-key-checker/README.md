# Own Key Checker

## Problem context

A debugging helper needs to explain exactly where a property comes from on a composed object: was it defined directly, inherited from a prototype, or does it not exist at all? This mirrors how JS itself resolves property lookups through the prototype chain.

## Goal

Read a parent object, a set of own properties for a child, and a key name from stdin. Build the child via `Object.create(parent)` plus `Object.assign`, then report whether the key is `own`, `inherited`, or `missing`.

## Lesson concepts practiced
- [ ] `Object.create(proto)` links a new object to `proto` without copying any properties
- [ ] `Object.assign(target, source)` copies properties as **own** properties onto `target`
- [ ] `Object.hasOwn(obj, key)` only reports own properties, never inherited ones
- [ ] `key in obj` checks the entire prototype chain (own and inherited)

## Functional requirements
- [ ] Read three lines from stdin: a JSON object for the parent, a JSON object for the child's own properties, and a key name
- [ ] Build `child = Object.create(parent)`, then `Object.assign(child, ownProps)`
- [ ] Print `own` if `Object.hasOwn(child, key)` is `true`
- [ ] Print `inherited` if `Object.hasOwn(child, key)` is `false` but `key in child` is `true`
- [ ] Print `missing` if the key is not found anywhere (own or inherited)

## Non-functional requirements
- [ ] Readability: implement a `classifyKey(child, key)` helper using the three-way rule above
- [ ] Error handling: invalid JSON on lines 1–2 may throw (no special requirement)
- [ ] Output is a single line ending with a newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not merge parent and child into a single plain object with the spread operator — use `Object.create` + `Object.assign` so the prototype link is real
- [ ] Input lines 1 and 2 are JSON objects (e.g. `{"a":1}`); line 3 is a plain key string

## Acceptance criteria
- [ ] Parent `{"a":1}`, child own `{"b":2}`, key `b` → stdout `own`
- [ ] Parent `{"a":1}`, child own `{"b":2}`, key `a` → stdout `inherited`
- [ ] Parent `{"a":1}`, child own `{"b":2}`, key `c` → stdout `missing`
- [ ] Parent `{}`, child own `{"x":1}`, key `x` → stdout `own`
- [ ] Parent `{"toString":"custom"}`, child own `{}`, key `toString` → stdout `inherited`

## Example data

Input:
```text
{"a":1}
{"b":2}
b
```

Output:
```text
own
```

Input:
```text
{"a":1}
{"b":2}
a
```

Output:
```text
inherited
```

Input:
```text
{"a":1}
{"b":2}
c
```

Output:
```text
missing
```

## Suggested plan (no solution)
1. Read three stdin lines; `JSON.parse` the first two, trim the third as `key`.
2. Build `child` with `Object.create(parent)` then `Object.assign(child, ownProps)`.
3. Implement `classifyKey(child, key)` using `Object.hasOwn` first, then `in`, else `missing`.
4. Print the result plus a newline.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a fourth stdin line with a grandparent object and chain two `Object.create` calls
- [ ] Accept a comma-separated list of keys on line 3 and print one classification per line
