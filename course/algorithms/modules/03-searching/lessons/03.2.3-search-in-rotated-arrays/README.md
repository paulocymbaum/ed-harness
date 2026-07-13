# Search in Rotated Arrays

> Graph index: `03.2.3`

## Context

A rotated sorted array looks like `[4,5,6,7,0,1,2]` — one ascending sequence spun left. You can still binary-search in `O(log n)` by noting that **at least one side of `mid` is sorted**.

## Predict first

`nums = [4,5,6,7,0,1,2]`, `target = 0`.

If `mid` lands on `7`, which half is sorted? Which half could contain `0`?

## Explanation

Assume distinct values:

1. Compute `mid`.
2. If `nums[mid] === target` return `mid`.
3. If `nums[lo] <= nums[mid]` → left half sorted:
   - If `nums[lo] <= target < nums[mid]` → search left, else right.
4. Else right half sorted:
   - If `nums[mid] < target <= nums[hi]` → search right, else left.

Rotation does not break binary search — it only changes **which** half you keep.

Duplicates complicate the "which half is sorted" test (may need to shrink `lo`/`hi` by one). This lesson focuses on the distinct case.

## What to observe

- Always identify a sorted side before asking if the target lies in it.
- Pivot finding is a related problem (minimum element) — same rotated structure.
- Falling back to linear search loses the logarithmic win.

## Quick challenge

Adapt the template to return the index of the minimum element (the rotation pivot) without a separate `target`.
