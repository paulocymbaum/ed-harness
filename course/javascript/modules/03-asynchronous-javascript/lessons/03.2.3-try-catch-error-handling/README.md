# Async Errors and try/catch

> Graph index: `03.2.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:03-asynchronous-javascript/03.2.3-try-catch-error-handling:README.md -->

## Context

Async errors propagate as **Promise rejections**. Sync `throw` / `try/catch` (taught in fundamentals) still matter; here the focus is catching rejections with `await` and normalizing Promise outcomes.

## Predict first

What prints?

```js
async function run() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (e) {
    console.log("caught", e.message);
  }
}

run();
```

## Explanation

Rejecting inside an async function rejects its returned Promise:

```js
async function fail() {
  throw new Error("oops");
}

fail().catch((e) => console.log(e.message));
```

The `toResult` pattern wraps a Promise into a success/error object:

```js
async function toResult(promise) {
  try {
    const value = await promise;
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error };
  }
}
```

## What to observe

- Throwing or rejecting inside `async` rejects the returned Promise.
- `try/catch` around `await` catches rejections without crashing the caller.
- `toResult` lets callers branch on `{ ok, value }` vs `{ ok: false, error }` without `try/catch`.

## Quick challenge

Implement `toResult(promise)` that returns `{ ok: true, value }` on fulfillment or `{ ok: false, error }` on rejection.
