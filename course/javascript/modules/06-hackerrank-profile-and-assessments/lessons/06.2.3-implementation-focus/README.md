# Implementation Focus

> Graph index: `06.2.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.2.3-implementation-focus:README.md -->

## Context

Many HackerRank and OA problems are tagged **Implementation**: they don't need a clever algorithm — they need you to translate a written spec into code **exactly**, handling every rule the statement lists. Most points lost on implementation problems come from missing a rule, not from picking the wrong algorithm.

## Bridge — edge cases (full lesson: `06.2.4`)

Implementation specs almost always hide **edge cases** — inputs or situations at the boundary of the rules. You will practice them systematically in `06.2.4`. For this lesson, treat these as checklist items whenever the statement mentions them:

- Empty input (`n = 0`, empty string, empty list)
- Single-element collections
- Zeros, negatives, and maximum allowed values
- Ties, duplicates, or “already sorted” data
- Off-by-one around inclusive/exclusive ranges

If a rule is easy to forget under the “happy path,” put it on your checklist before you submit.

## Why a checklist mindset works here

Because the difficulty is in *completeness*, not cleverness, treating the spec like a checklist you tick off one requirement at a time catches gaps before you submit:

- Read every sentence of the spec as a separate rule, not just the general idea.
- Track which rules you've implemented (`[x]`) versus which are still open (`[ ]`).
- A problem "feels solved" long before every rule is actually covered — the checklist keeps that honest.

## Turning a checklist into a status line

If you jot your own progress as lines starting with `[x]` (done) or `[ ]` (todo), counting each kind gives you an honest snapshot of how much of the spec is actually implemented.

## Predict first

Given a list of checklist lines, predict how many are marked done vs still todo:

```text
[x] parse input
[ ] handle negative numbers
[x] print result
[ ] handle empty input
```

How many `done` and how many `todo`?

## What to observe

- Only the exact markers `[x]` (done) and `[ ]` (todo) at the **start** of a line count — free-form notes don't.
- The counts describe completeness of the spec, not correctness — a "done" item can still be implemented wrong.
- Implementation-focused problems reward re-reading the statement more than they reward a faster algorithm.
- A checklist with any `[ ]` left is a concrete reason to keep reading the spec before submitting.

## Quick challenge

Your checklist shows `done=5 todo=0`, but the submission still fails a hidden test case. Given what "done" means here, what's the most likely explanation?
