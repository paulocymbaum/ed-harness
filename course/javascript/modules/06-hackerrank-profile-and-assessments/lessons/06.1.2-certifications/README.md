# Certifications

> Graph index: `06.1.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.1.2-certifications:README.md -->

## Context

HackerRank **Skill Certifications** are timed, proctored tests for a specific skill (e.g. "Problem Solving (Basic)", "JavaScript (Intermediate)", "SQL (Advanced)"). Unlike regular practice challenges, a certification attempt has one binary outcome: you **pass** or you **fail** the whole attempt. There's no partial credit shown on the profile — only a passed attempt produces a certificate badge.

## Pass/fail, not a score

Certifications differ from the practice Problem-Solving Score in an important way:

- A certification attempt is graded as **passed** or **failed** as a whole, based on a minimum score threshold set by HackerRank.
- Only **passed** attempts show up as a certificate/badge on the public profile.
- A failed attempt is not displayed publicly — you can usually retry after a cooldown period.
- Recruiters treat a certification as a **verified** claim: unlike self-reported skills, it was earned under a timed, proctored test.

## Why this matters for your profile

A certification badge is a stronger signal than an unverified skill claim because the test conditions (time limit, proctoring) make it harder to fake. That's why gating logic around certifications only cares about the pass/fail outcome, not a numeric score.

## Predict first

A gate needs to turn a raw attempt outcome into a profile-facing label: `passed` → `verified`, `failed` → `not-verified`.

Predict the label for each attempt:

- `passed` → ?
- `failed` → ?
- `passed` → ?

## What to observe

- The outcome is binary: there is no "almost passed" state that produces a badge.
- Only `passed` attempts become a visible, `verified` credential.
- A `failed` attempt maps to `not-verified` — it simply doesn't add a badge, it isn't a penalty.
- Certifications are separate from the Problem-Solving Score: passing "JavaScript (Intermediate)" doesn't change your SQL or Problem Solving score.

## Quick challenge

A candidate re-attempts a certification twice: `failed`, then `passed`. What does the profile show after both attempts — one badge, no badge, or two badges?
