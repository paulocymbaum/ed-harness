# Code Quality and Maintainability

> Graph index: `07.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/07-technical-interview-preparation/07.4-code-quality-and-maintainability:README.md -->

## Context

A correct solution that ships with leftover `console.log` debugging, `TODO` comments, or sloppy variable declarations reads as unfinished — even if the logic is right. Interviewers scan for these small **code smells** as a proxy for how you'd behave on a real team: do you clean up after yourself, name things clearly, and avoid patterns that cause bugs later (like `var`'s function-scoping surprises)?

## Predict first

You're reviewing a teammate's pull request and see this snippet before it merges:

```js
function total(items) {
  var sum = 0;
  console.log("debugging", items);
  // TODO: handle empty array
  for (var i = 0; i < items.length; i++) sum += items[i];
  return sum;
}
```

Before reading further: list every smell you'd flag in code review, and say **why** each one matters (not just "it's bad practice").

## Explanation

Three smells in that snippet, and why each one matters in a real codebase:

- **`console.log("debugging", ...)`** — debug output left in shipped code. It pollutes logs, may leak data, and signals the code wasn't cleaned up before review.
- **`// TODO: handle empty array`** — an acknowledged gap left unresolved. If the array is empty, `sum` silently returns `0`, which might be wrong depending on the caller's expectations; the TODO admits the author knew and didn't finish.
- **`var i`** / **`var sum`** — `var` is function-scoped and hoisted, which can leak loop variables outside the intended block and enable rebinding bugs that `let`/`const` prevent at parse time.

None of these smells necessarily make the function *incorrect* for the happy path — that's exactly why they're easy to miss and exactly why interviewers look for candidates who catch them anyway.

## What to observe

- Code smells are about **maintainability risk**, not necessarily "this is broken right now."
- Leftover debug statements (`console.log`) and unresolved `TODO`s are both signs of incomplete cleanup before review.
- `var` is a smell in modern JavaScript because `let`/`const` give safer scoping — flag it even when the code "works."
- Naming a smell should come with a reason: what could go wrong later, not just "this is against style guide X."

## Quick challenge

Scan this snippet and list every smell you'd flag, with a one-sentence reason for each:

```js
function greet(name) {
  var msg = "Hello, " + name;
  console.log(msg);
  // TODO: support i18n
  return msg;
}
```
