# Throwing Errors and Sync try/catch

> Graph index: `01.7.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/01-javascript-fundamentals/01.7.4-throwing-errors-and-sync-try-catch:README.md -->

## Context

When a function hits an invalid situation (bad input, impossible state), it can **throw** an error instead of returning a quiet wrong value. With synchronous `try` / `catch` / `finally`, the caller can recover, log a clear message, and keep the rest of the script running.

Async errors (`Promise` rejections) are a later topic — this lesson stays on **sync** throw and catch.

## Predict first

What prints?

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));
  console.log(divide(10, 0));
  console.log("after divides");
} catch (err) {
  console.log("caught:", err.message);
}
console.log("done");
```

## Explanation

### Throwing an error

`throw` stops the current path of execution. Prefer `new Error("message")` so the catch block gets a real `Error` with `.message` and a stack.

```js
function requirePositive(n) {
  if (typeof n !== "number" || !(n > 0)) {
    throw new Error("Expected a positive number");
  }
  return n;
}

console.log(requirePositive(3));
// requirePositive(-1); // would throw
```

You can throw other values (`throw "oops"`), but that makes catch harder — stick to `Error`.

### try / catch

Code inside `try` runs normally until something throws. Then control jumps to `catch`. Lines after the throw inside `try` do **not** run.

```js
try {
  console.log("before");
  throw new Error("boom");
  console.log("after throw"); // skipped
} catch (err) {
  console.log(err.message); // "boom"
}
```

### finally

`finally` always runs — after a successful `try`, or after `catch` — so it is useful for cleanup that must happen either way.

```js
function parseScore(raw) {
  try {
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      throw new Error("Not a finite number");
    }
    return n;
  } catch (err) {
    console.log("parse failed:", err.message);
    return null;
  } finally {
    console.log("parse attempt finished");
  }
}

console.log(parseScore("42"));
console.log(parseScore("x"));
```

### Errors bubble up

If a function throws and has no local `try`/`catch`, the error propagates to the caller. Catch at the level that can handle it.

```js
function inner() {
  throw new Error("from inner");
}

function outer() {
  inner(); // no catch here — bubbles out
}

try {
  outer();
} catch (err) {
  console.log(err.message); // "from inner"
}
```

## What to observe

- `throw new Error("…")` signals failure; `return` signals a normal result.
- After a throw inside `try`, the rest of that `try` block is skipped.
- `catch (err)` receives the thrown value — use `err.message` for the text.
- `finally` runs whether the `try` succeeded or an error was caught.
- Uncaught sync errors stop the current call stack (and typically crash a Node script).

## Pitfall

```js
try {
  throw new Error("fail");
} catch (err) {
  console.log(err.message);
}
// This is OUTSIDE try — a throw here is not caught by the block above:
// throw new Error("uncaught");
```

Also: catching and ignoring (`catch (_) {}`) hides bugs. At least log `err.message`, or rethrow if you cannot fix the problem.

## Quick challenge

Write `function assertString(value)` that throws `new Error("Expected a string")` when `typeof value !== "string"`, otherwise returns `value`. Call it inside a `try`/`catch` with `"ok"` and with `42`, and print either the returned string or `err.message`.
