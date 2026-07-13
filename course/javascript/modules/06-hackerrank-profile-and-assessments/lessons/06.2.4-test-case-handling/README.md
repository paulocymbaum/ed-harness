# Test Case Handling

> Graph index: `06.2.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.2.4-test-case-handling:README.md -->

## Context

HackerRank grades submissions **per test case**, not pass/fail as a whole — a solution can score, say, 7 out of 10 test cases and still receive partial credit. The test cases you never see (hidden ones) are usually written specifically to probe **edge cases**: empty input, a zero value, a negative value, or a single-element input where "the general case" logic quietly breaks.

## The usual suspects

A short mental checklist of edge cases catches most partial-credit losses before submission:

- **Empty** input — no elements, an empty string, or an empty line.
- **Zero** — a numeric value of exactly `0`, which can break logic written as "if the value" (truthy checks) or division.
- **Negative** — negative numbers, which break assumptions like "always positive" or naive absolute-value logic.
- **Single** — exactly one element, which breaks logic that assumes "at least two to compare".

## Naming what's present

Being able to name which of these categories a given input actually exercises makes it easier to reason about whether your code handles it — that's what this lesson's project reports directly.

## Predict first

Given a line of space-separated flag tokens drawn from `empty`, `zero`, `neg`, `single`, predict which ones should be reported, sorted alphabetically:

- `zero neg` → ?
- `single` → ?
- (no tokens) → ?
- `neg empty zero` → ?

## What to observe

- Only the four known tokens (`empty`, `zero`, `neg`, `single`) are recognized categories — anything else is noise to ignore.
- Output is always sorted alphabetically, regardless of the input order.
- No recognized tokens present means the answer is `none`, not an empty line.
- These four categories aren't specific to one problem — they're a reusable pre-submission checklist for almost any HackerRank challenge.

## Quick challenge

A problem statement says "the array has at least 2 elements" but a hidden test case still passes an array of length 1. Which edge-case category does that violate, and why is it worth testing anyway?
