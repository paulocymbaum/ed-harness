# Sorting

> Graph index: `02`

## Motivation

Sorting is the classic place where algorithm choice shows up in real code: leaderboards, timelines, invoice lines, and “sort by name then date.” JavaScript gives you `Array.prototype.sort`, but interviews and production edge cases still reward knowing **how** sorts work — stability, memory, and when a linear-time non-comparison sort beats Quick Sort.

This module moves from teaching sorts (bubble → merge/quick/heap) through JS runtime behavior and into **decision-making**: which sort fits nearly sorted data, tight memory, or multi-key orderings.

## Lesson map

### 02.1 Elementary Sorts
- `02.1.1` Bubble Sort
- `02.1.2` Selection Sort
- `02.1.3` Insertion Sort

### 02.2 Efficient Comparison Sorts
- `02.2.1` Merge Sort
- `02.2.2` Quick Sort
- `02.2.3` Heap Sort
- `02.2.4` Shell Sort

### 02.3 Non-Comparison Sorts
- `02.3.1` Counting Sort
- `02.3.2` Radix Sort
- `02.3.3` Bucket Sort

### 02.4 JS Runtime Sorting
- `02.4.1` Array.prototype.sort
- `02.4.2` Custom Comparators
- `02.4.3` Stability and Pitfalls
- `02.4.4` Sorting Objects by Keys

### 02.5 Choosing a Sort
- `02.5.1` Nearly Sorted Data
- `02.5.2` Memory Constraints
- `02.5.3` Sort by Multiple Keys
- `02.5.4` Online vs Offline Sorting

## Checklist

- [ ] Implement at least one elementary and one O(n log n) comparison sort from scratch
- [ ] Know when counting/radix/bucket sorts apply (and when they do not)
- [ ] Write a correct numeric comparator for `Array.prototype.sort` (avoid lexicographic bugs)
- [ ] Explain stability with an example of equal keys
- [ ] Pick a sort strategy given nearly sorted input vs memory limits vs multi-key order
