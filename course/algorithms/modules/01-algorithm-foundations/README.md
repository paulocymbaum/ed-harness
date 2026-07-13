# Algorithm Foundations

> Graph index: `01`

## Motivation

Before you memorize sort names or write a binary search, you need a shared language for **cost**, **structure**, and **correctness**. This module builds that language in JavaScript: how to read Big-O, when recursion vs iteration matters, and how to prove a loop actually finishes.

Without these habits, sorting and searching lessons turn into copy-paste recipes. With them, you can explain why one approach is right for nearly sorted data and another for huge integer ranges.

## Lesson map

### 01.1 Complexity Thinking
- `01.1.1` Time Complexity Big-O
- `01.1.2` Space Complexity
- `01.1.3` Best Average Worst Case
- `01.1.4` Amortized Analysis

### 01.2 Problem Patterns in JS
- `01.2.1` Arrays and Typed Arrays
- `01.2.2` Map and Set as Tooling
- `01.2.3` Recursion vs Iteration
- `01.2.4` Divide and Conquer

### 01.3 Correctness Habits
- `01.3.1` Invariants and Edge Cases
- `01.3.2` Comparator Contracts
- `01.3.3` Measuring with console.time
- `01.3.4` Proving Termination

## Checklist

- [ ] Explain O(1), O(n), O(n log n), and O(n²) with a short JS snippet for each
- [ ] Distinguish auxiliary space from input size
- [ ] Prefer `Map`/`Set` when key identity or membership is the bottleneck
- [ ] State a loop invariant and an edge-case list before coding
- [ ] Measure with `console.time` instead of guessing which version is faster
