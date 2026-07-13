# Badges

> Graph index: `06.1.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.1.3-badges:README.md -->

## Context

**Skill badges** (different from certification badges) are earned by solving a certain number of challenges inside a practice track, such as "Problem Solving", "Python", or "Algorithms". Each badge has tiers (e.g. bronze/silver/gold), and the profile shows **progress toward the next tier** as a fraction: how many qualifying challenges you've solved out of how many are needed.

## Progress, not pass/fail

Badges behave differently from certifications:

- A badge tracks **cumulative solved count** in a domain, not a single timed attempt.
- The profile shows an `earned / total` style progress indicator for the current tier.
- Once `earned` reaches `total` for a tier, the badge tier is **complete** and progress resets toward the next tier.
- Unlike a certification, there's no failure state — you're always either still working toward the badge or you've completed it.

## Why progress fractions matter

Seeing `earned/total` (e.g. `18/20`) tells you exactly how close a profile is to the next tier, which is more actionable than a single pass/fail flag. This lesson's project reports that state directly.

## Predict first

Given `earned` and `total` solved counts for a badge tier, predict the status label and the fraction that should be printed:

- `earned = 20, total = 20` → ?
- `earned = 12, total = 20` → ?
- `earned = 0, total = 15` → ?

## What to observe

- `complete` only happens when `earned` equals `total` — not when it merely gets close.
- Any `earned` strictly less than `total` is `in-progress`, even at `19/20`.
- The fraction is always reported as `earned/total`, in that order, regardless of status.
- Badges accumulate over time across many submissions — there's no "attempt" concept like certifications have.

## Quick challenge

A profile shows badge progress `earned = 20, total = 20` for tier 1. The next day it shows `earned = 1, total = 40` for the same badge slot. What happened between the two snapshots?
