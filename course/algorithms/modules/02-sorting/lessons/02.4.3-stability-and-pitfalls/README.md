<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.4.3-stability-and-pitfalls:README.md -->

# Stability and Pitfalls

> Graph index: `02.4.3`

## Context

A sort is **stable** if equal keys keep their original relative order. Stability matters when you sort by secondary keys first, then primary, or when equal items carry different payloads. Unstable algorithms can scramble that history.

## Predict first

You sort people by last name (stable) after sorting by first name. Do equal last names still reflect first-name order?

## Explanation

Typically stable: insertion, merge (with careful `<=`), bubble (strict `>` only), modern `Array.prototype.sort`. Typically unstable: quicksort, heapsort, selection, shell.

Pitfalls:

- Assuming default JS sort is numeric.
- Mutating shared arrays.
- Using boolean comparators.
- Multi-key sorts without stability (or without a single combined comparator).

## What to observe

- Stability is about **equal keys**, not sortedness.
- You can emulate stability by decorating keys with original indices.
- Unstable primary sorts destroy prior secondary order.

## Quick challenge

Name one stable and one unstable sort from this module’s earlier lessons.
