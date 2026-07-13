<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.3.3-bucket-sort:README.md -->

# Bucket Sort

> Graph index: `02.3.3`

## Context

Bucket sort scatters elements into **buckets** by a hash/range of the key, sorts each bucket (often insertion), then concatenates. Expect near-linear time when keys distribute evenly across buckets.

## Predict first

Values in `[0,1)`, `n = 4` buckets, value `0.42`: which bucket index `floor(0.42 * 4)`?

## Explanation

Common uniform-`[0,1)` sketch:

```js
function bucketIndex(x, bucketCount) {
  return Math.min(bucketCount - 1, Math.floor(x * bucketCount));
}
```

After scatter, sort each bucket and concat. Bad distributions pile into one bucket → degrades toward the inner sort’s cost. Related to counting/radix when buckets align with discrete ranges. Good for floats in a known interval; need a careful mapping for arbitrary domains.

## What to observe

- Even spread is an assumption, not a law.
- Bucket count trades memory vs inner sort size.
- Edge values must map into `0..bucketCount-1` safely.

## Quick challenge

What goes wrong if almost all keys land in bucket `0`?
