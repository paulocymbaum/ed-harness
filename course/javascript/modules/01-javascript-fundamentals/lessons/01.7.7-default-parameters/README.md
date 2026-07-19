# Default Parameters

> Graph index: `01.7.7`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.7-default-parameters:README.md -->

## Context

When a caller omits an argument, the parameter is `undefined` (`01.7.2`). **Default parameters** fill that gap at the declaration: `param = value` runs only when the argument is missing or explicitly `undefined`. Optional prefixes, modes, and thresholds become clearer without manual `if (x === undefined)` nesting.

## Predict first

What prints?

```js
function greet(name, greeting = "Hello") {
  return greeting + ", " + name + "!";
}

console.log(greet("Ana"));
console.log(greet("Bob", "Hi"));
```

## Explanation

### Defaults when undefined

```js
function volume(width, height = 1, depth = 1) {
  return width * height * depth;
}

console.log(volume(3));          // 3 — height and depth default
console.log(volume(3, 2));       // 6
console.log(volume(3, 2, 4));    // 24
console.log(volume(3, undefined, 4)); // 12 — undefined triggers default for height
```

### Passed values win — including falsy ones

Defaults do **not** replace `0`, `""`, or `false`. Only `undefined` (or an omitted argument) triggers the default.

```js
function label(text, prefix = "TAG") {
  return prefix + ":" + text;
}

console.log(label("ok"));        // TAG:ok
console.log(label("ok", ""));    // :ok — empty string was passed on purpose
console.log(label("ok", "ID"));  // ID:ok
```

### Order: defaults after required (usual style)

Put parameters without defaults first so callers can omit trailing optionals cleanly:

```js
function formatShare(amount, currency = "USD") {
  return currency + " " + amount.toFixed(2);
}

console.log(formatShare(12.5));
console.log(formatShare(12.5, "BRL"));
```

## What to observe

- `param = default` applies when the argument is omitted or `undefined`.
- Explicit `0`, `""`, and `false` are kept — they are not “missing.”
- Prefer defaults for optional trailing parameters.
- Defaults replace the common `if (x === undefined) x = …` pattern at the top of helpers.

## Quick challenge

Predict each line:

```js
function clamp(value, min = 0, max = 100) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

console.log(clamp(50));
console.log(clamp(-5));
console.log(clamp(50, 10, 20));
console.log(clamp(5, undefined, 10));
```
