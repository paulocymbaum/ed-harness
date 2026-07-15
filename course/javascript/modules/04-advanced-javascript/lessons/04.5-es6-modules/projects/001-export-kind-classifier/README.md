# Export Kind Classifier

## Problem context

A lint rule needs to flag mismatched import/export styles across a codebase (e.g. importing a named export without braces). The first step is reliably classifying any single export/import line into one of four kinds, based on simple prefix rules — the same rules a human reviewer applies at a glance.

## Goal

Read one line of module syntax from stdin and print its kind: `default-export`, `named-export`, `default-import`, or `named-import`.

## Lesson concepts practiced
- [ ] `export default ...` declares the module's single default export
- [ ] `export { X }` and `export const X` (or `let`/`function`/`class`) are both named exports
- [ ] `import X from "..."` (no braces) always targets a default export
- [ ] `import { X } from "..."` (with braces) always targets a named export

## Functional requirements
- [ ] Read exactly one line from stdin
- [ ] If the line starts with `export default` → print `default-export`
- [ ] Else if the line starts with `export` (covers `export {` and `export const`/`let`/`function`/`class`) → print `named-export`
- [ ] Else if the line starts with `import` and contains a `{` → print `named-import`
- [ ] Else if the line starts with `import` (no `{`) → print `default-import`

## Non-functional requirements
- [ ] Readability: implement a single `classify(line)` helper applying the rules in order
- [ ] Error handling: a line matching none of the rules may throw (no special requirement)
- [ ] Output is a single line ending with a newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Use simple prefix/substring checks (`startsWith`, `includes`) — do not write a full JS parser
- [ ] Check `export default` before the generic `export` prefix, since both start with `export`

## Acceptance criteria
- [ ] Input `export default function main() {}` → stdout `default-export`
- [ ] Input `export { helper, util };` → stdout `named-export`
- [ ] Input `export const PI = 3.14;` → stdout `named-export`
- [ ] Input `import config from "./config.js";` → stdout `default-import`
- [ ] Input `import { helper } from "./utils.js";` → stdout `named-import`

## Example data

Input:
```text
export default function main() {}
```

Output:
```text
default-export
```

Input:
```text
import { helper } from "./utils.js";
```

Output:
```text
named-import
```

## Suggested plan (no solution)
1. Read the single stdin line.
2. Implement `classify(line)`: check `export default` first, then plain `export`, then `import` + `{`, then plain `import`.
3. Print the resulting kind plus a newline.
4. Mentally check all five example patterns from the lesson against the rule order.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Detect `import * as X from "..."` as its own `namespace-import` kind
- [ ] Detect `export * from "..."` as its own `re-export` kind
