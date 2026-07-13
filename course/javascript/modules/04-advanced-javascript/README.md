# Advanced JavaScript

> Graph index: `04`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript:README.md -->

This module covers language mechanics that show up constantly in interviews and production debugging: **hoisting / TDZ**, **closures**, **higher-order functions**, the **prototype chain**, and **ES modules**.

## Motivation

Fundamentals get you writing scripts. Advanced JavaScript explains *why* code behaves the way it does when scopes, inheritance, and module boundaries collide.

Typical interview / OA failures:
- Accessing `let` before initialization (TDZ)
- Unexpected shared state from a loop + closure
- Using `typeof` / own-property checks when inheritance matters
- Confusing CommonJS `require` with ESM `import`/`export`

## Lesson map

| Index | Lesson | Focus |
|-------|--------|--------|
| 04.1 | Hoisting and TDZ | `var` vs `let`/`const`, temporal dead zone |
| 04.2 | Closures | Functions that remember their lexical environment |
| 04.3 | Higher-Order Functions | Functions that take/return functions |
| 04.4 | Prototype Chain | `[[Prototype]]`, inheritance lookups |
| 04.5 | ES6 Modules | `import` / `export`, module scope |

## Checklist

- [ ] I can predict TDZ ReferenceErrors vs `undefined` from `var`
- [ ] I can explain a closure in one sentence and build a private counter
- [ ] I can write a small `map`/`filter` pipeline without mutating input
- [ ] I can tell own properties from inherited ones
- [ ] I can describe default vs named ESM exports
