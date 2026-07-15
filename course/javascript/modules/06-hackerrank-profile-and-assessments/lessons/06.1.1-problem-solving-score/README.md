# Problem-Solving Score

> Graph index: `06.1.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.1.1-problem-solving-score:README.md -->

## Context

Every HackerRank domain (Problem Solving, SQL, JavaScript, ...) tracks a **score** per profile. It grows every time you submit a challenge that passes its test cases: harder challenges (Medium, Hard) are worth more points than Easy ones, and the score accumulates **per domain**, not as one global number. A profile can show a strong Problem Solving score and a zero SQL score at the same time — recruiters read each domain separately.

## Score is a signal, not a grade

The exact points-per-challenge formula isn't something you need to memorize. What matters practically:

- Score only grows from **challenges that pass**, not from attempts.
- Consistent practice across many challenges compounds faster than grinding one Hard problem.
- A high score in one domain says nothing about another domain — check the domain, not just the number.

## Reading a score at a glance

Because the raw number by itself is hard to interpret, it helps to think in **bands**: a profile that just started, one that practices regularly, and one that has cleared a large volume of harder challenges. This lesson's project turns a raw score into exactly that kind of band label.

## Predict first

A simple triage filter uses these thresholds on a 0–100 scale: below 40 is `beginner`, 40 up to 69 is `intermediate`, 70 and above is `advanced`.

Predict the band for each score before checking:

- `score = 12` → ?
- `score = 40` → ?
- `score = 69` → ?
- `score = 70` → ?

## What to observe

- Score only increases from **passing** submissions — failed attempts don't count.
- Bands are boundaries: `40` is already `intermediate`, `69` is still `intermediate`, `70` is the first `advanced` value.
- The score is domain-scoped: "Problem-Solving Score" is unrelated to a "SQL score" on the same profile.
- A single high-difficulty solve can matter less than steady practice across many challenges.

## Quick challenge

Given three profile scores — `35`, `70`, `55` — sort them into bands. Which one is a single point away from the next band up?
