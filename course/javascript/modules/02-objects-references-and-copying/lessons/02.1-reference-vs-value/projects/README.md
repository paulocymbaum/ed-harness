# Projects — Reference vs Value

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

## What you should practice

- Primitives copy by value; objects alias by reference
- Returning a **new** object vs mutating the input through shared references
- Detecting accidental mutation of nested objects/arrays

## Project catalog

### 001-safe-normalizer/

Normalize a user payload into a cleaned copy. Must not mutate the original input object (reference vs value in practice).
