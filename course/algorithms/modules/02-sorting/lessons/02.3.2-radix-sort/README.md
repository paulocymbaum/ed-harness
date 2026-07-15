<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.3.2-radix-sort:README.md -->

# Radix Sort

> Graph index: `02.3.2`

## Context

Radix sort sorts integers (or fixed-length keys) **digit by digit**, often LSD (least significant digit first) using a stable counting sort per digit. With `d` digits and base `b`, time is about `O(d·(n + b))`.

## Predict first

For number `723` in base 10, what is the least-significant digit? The hundreds digit?

## Explanation

Extract digit at place `p` (`p = 0` ones, `1` tens, …):

```js
function digit(x, p, base = 10) {
  return Math.floor(x / base ** p) % base;
}
```

LSD radix: stable-sort by digit 0, then 1, then … up to max digits. MSD radix starts at the high digit and can early-out on buckets. Needs a stable subroutine per pass. Great for fixed-width integers/UUIDs with small alphabets; awkward for arbitrary comparable objects.

## What to observe

- Each pass must be **stable** or later digits ruin earlier order.
- Digit width / base trades passes vs bucket size.
- Still non-comparison when the digit extractor is arithmetic.

## Quick challenge

Why does LSD radix need stability between digit passes?
