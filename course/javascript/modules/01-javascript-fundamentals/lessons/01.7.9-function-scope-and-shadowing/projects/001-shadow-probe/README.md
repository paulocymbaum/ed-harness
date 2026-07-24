# Shadow Probe

## Problem context
Debugging “why didn’t my variable change?” often means a parameter **shadowed** an outer binding. This CLI makes both bindings visible: the argument inside the probe, and the unchanged outer marker after the call.

## Goal
Keep a module-level `marker`, implement `probe(marker)` that returns the **parameter**, and print both inner and outer values.

## Lesson concepts practiced
- [ ] Parameters and locals are confined to the function call.
- [ ] Same name inside = shadowing; the outer binding is hidden for that scope.
- [ ] Assigning to a parameter or local does not rewrite the outer variable.

## Functional requirements
- [ ] At module scope declare `let marker = "outer"` (exact initial value).
- [ ] Implement `function probe(marker)` that returns `marker` (the parameter) — do not read a differently named outer on purpose inside `probe`.
- [ ] Read one trimmed line from stdin as the argument. Empty → `ERROR: empty marker`.
- [ ] Call `const inner = probe(arg)`.
- [ ] Print exactly two lines:
  - `inner: <inner>`
  - `outer: <marker>` (the module-level binding, still `"outer"`)

## Non-functional requirements
- [ ] Parameter name must be `marker` so it shadows the outer binding
- [ ] Do not reassign the outer `marker` in `main`

## Constraints
- [ ] Node.js only
- [ ] Outer binding name and parameter name must both be `marker`

## Acceptance criteria
- [ ] Input `arg` →
  ```
  inner: arg
  outer: outer
  ```
- [ ] Input `inner` →
  ```
  inner: inner
  outer: outer
  ```
- [ ] Empty input → `ERROR: empty marker`
- [ ] Module-level `marker` remains `"outer"` after the call

## Example data

Input:
- `arg`

Output:
- `inner: arg`
- `outer: outer`

## Suggested plan (no solution)
1. Declare outer `let marker = "outer"`.
2. Write `probe(marker)` that returns its parameter.
3. Parse stdin; call `probe`; print `inner` and `outer` lines.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add a second helper that does **not** shadow and returns the outer `marker`.
