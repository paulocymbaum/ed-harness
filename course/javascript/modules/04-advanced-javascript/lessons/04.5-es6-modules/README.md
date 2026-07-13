# ES6 Modules

> Graph index: `04.5`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/04-advanced-javascript/04.5-es6-modules:README.md -->

## Context

ES modules split code into files that explicitly declare what they **export** and what they **import**. Each module can have at most one **default export**, plus any number of **named exports** — and the import syntax must match which kind was used.

## Named exports

```js
// math.js
export const add = (a, b) => a + b;
export function subtract(a, b) { return a - b; }
```

```js
// main.js
import { add, subtract } from "./math.js";
```

`export const X` and `export { X }` both declare **named** exports — the importing file must use curly braces and the exact exported name.

## Default export

```js
// logger.js
export default function log(message) { console.log(message); }
```

```js
// main.js
import log from "./logger.js";
```

A module can have only **one** default export. The importing side chooses any local name (`log`, `myLogger`, …) — no curly braces, because there's exactly one thing to import.

## Matching import style to export style

```js
export { helper };        // named export → import { helper } from "..."
export default helper;    // default export → import helper from "..."

import { helper } from "./utils.js"; // named import — braces required
import helper from "./utils.js";     // default import — no braces
```

Mixing them up is a common bug: importing a named export without braces (or a default export with braces) fails silently or throws, depending on the bundler.

## Predict first

For each line, is it a default export, named export, default import, or named import?

```js
export default function main() {}
export { helper, util };
export const PI = 3.14;
import config from "./config.js";
import { helper } from "./utils.js";
```

## What to observe

- `export default ...` → exactly one default export per module.
- `export { X }` and `export const X` (or `let`/`function`/`class`) are both **named** exports — same import style (`import { X }`).
- `import X from "..."` (no braces) always targets a **default** export.
- `import { X } from "..."` (with braces) always targets a **named** export.
- A module can mix one default export with any number of named exports in the same file.

## Mini-exercise

Predict, then verify — classify each line as one of `default-export`, `named-export`, `default-import`, `named-import`:

```js
export default class Widget {}
export const version = "1.0";
import Widget from "./widget.js";
import { version } from "./widget.js";
```
