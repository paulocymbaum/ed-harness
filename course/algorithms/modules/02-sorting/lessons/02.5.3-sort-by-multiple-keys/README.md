<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.5.3-sort-by-multiple-keys:README.md -->

# Sort by Multiple Keys

> Graph index: `02.5.3`

## Context

Multi-key order means: compare **primary** key first; only if equal, compare **secondary**, and so on. Implement with one comparator (preferred) or successive stable sorts from the last key to the first.

## Predict first

Records `(math:90, name:Ann)` vs `(math:90, name:Bob)` sorted by math desc then name asc — who wins?

## Explanation

```js
rows.sort((a, b) => {
  if (b.math !== a.math) return b.math - a.math; // primary desc
  return a.name.localeCompare(b.name);           // secondary asc
});
```

Or: `return b.math - a.math || a.name.localeCompare(b.name)`.

Successive sorts: sort by name ascending (stable), then by math descending (stable). Unstable engines / algorithms break the chain. Prefer one explicit comparator in interview code.

## What to observe

- Primary difference short-circuits the rest.
- Direction (asc/desc) is per key.
- Stability matters only for the successive-sort technique.

## Quick challenge

If two rows tie on all listed keys, what should the comparator return?
