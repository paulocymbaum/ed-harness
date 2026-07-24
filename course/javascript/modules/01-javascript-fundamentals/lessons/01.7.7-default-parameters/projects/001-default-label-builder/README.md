# Default Label Builder

## Problem context
Log labels often share a default prefix. Callers should omit the prefix when the default is fine, and only pass a custom one when needed.

## Goal
Implement `buildLabel(text, prefix = "TAG")`, read text (and optional prefix) from stdin, and print the label.

## Lesson concepts practiced
- [ ] `param = default` applies when the argument is omitted or `undefined`.
- [ ] Explicit `0`, `""`, and `false` are kept — they are not “missing.”
- [ ] Prefer defaults for optional trailing parameters.

## Functional requirements
- [ ] Implement `function buildLabel(text, prefix = "TAG")` returning `prefix + ":" + text`.
- [ ] Line 1 (required): `text` after trim. Empty → `ERROR: empty text`.
- [ ] Line 2 (optional): if present, pass it as `prefix` (including empty string after trim → prefix `""`).
- [ ] If line 2 is absent, call `buildLabel(text)` so the default `"TAG"` applies.
- [ ] Print the returned label.

## Non-functional requirements
- [ ] Use a real default parameter — do not manually assign `prefix = "TAG"` inside the body
- [ ] Pure helper (no I/O inside `buildLabel`)

## Constraints
- [ ] Node.js only
- [ ] Default parameter syntax required on `prefix`

## Acceptance criteria
- [ ] Omitting prefix applies default `"TAG"`: input `ok` (one line) → `TAG:ok`
- [ ] Passed prefix wins: input `ok` / `ID` → `ID:ok`
- [ ] Explicit empty string is kept (not missing): input `ok` / `` → `:ok`
- [ ] Input empty first line → `ERROR: empty text`
- [ ] Default is declared on the parameter (`prefix = "TAG"`), not assigned inside the body

## Example data

Input:
- `payment`

Output:
- `TAG:payment`

## Suggested plan (no solution)
1. Declare `buildLabel` with default `prefix = "TAG"`.
2. Read lines; validate text.
3. Call with one or two arguments depending on whether line 2 exists.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a third optional `suffix` defaulting to `""`.
