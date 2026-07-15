# Searching

> Graph index: `03`

## Motivation

Most “find it” problems are not a single `indexOf`. They are **linear scans with structure** (two pointers, sliding window, prefix sums), **logarithmic probes** on sorted data, **hash lookups**, or **graph/tree traversal**. In JavaScript you also hit quirks: object keys coerce to strings, while `Map`/`Set` keep identity.

This module trains you to match the access pattern to the right search tool — and to reconstruct paths or explore candidates when the answer is a sequence, not a single index.

## Lesson map

### 03.1 Linear Techniques
- `03.1.1` Linear Search
- `03.1.2` Two Pointers
- `03.1.3` Sliding Window
- `03.1.4` Prefix Sums

### 03.2 Logarithmic Search
- `03.2.1` Binary Search
- `03.2.2` Lower and Upper Bound
- `03.2.3` Search in Rotated Arrays
- `03.2.4` Binary Search on Answer

### 03.3 Hash-Based Lookup
- `03.3.1` Object Key Lookup Limits
- `03.3.2` Map for O1 Access
- `03.3.3` Set for Membership
- `03.3.4` Frequency Maps

### 03.4 Graph and Tree Search
- `03.4.1` DFS
- `03.4.2` BFS
- `03.4.3` Path Reconstruction
- `03.4.4` Backtracking Search

## Checklist

- [ ] Solve a two-pointers and a sliding-window problem without nested O(n²) scans when a linear pass works
- [ ] Implement binary search and explain lower vs upper bound
- [ ] Prefer `Map`/`Set` over plain objects when keys are not safe strings
- [ ] Build frequency maps for anagram / counting style problems
- [ ] Trace DFS vs BFS and reconstruct a path from parent pointers
