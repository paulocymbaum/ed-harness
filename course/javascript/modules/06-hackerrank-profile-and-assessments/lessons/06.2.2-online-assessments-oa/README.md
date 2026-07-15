# Online Assessments (OA)

> Graph index: `06.2.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.2.2-online-assessments-oa:README.md -->

## Context

An **Online Assessment (OA)** is a timed, remote screening test a company sends candidates early in the hiring pipeline — often hosted on HackerRank. It usually bundles a handful of coding questions of varying weight, plus sometimes multiple-choice questions, inside a single fixed time window (e.g. 90 minutes) that you generally cannot pause once started.

## Time pressure changes your strategy

Because the whole session runs against one countdown, how much time is left should change what you do next:

- Early in the window, you can afford to **plan**: read every question fully before writing code.
- In the middle stretch, keep a steady **pace**: move on once a question is taking too long relative to its weight.
- Near the end, switch to **rush** mode: bank partial credit on whatever passes the most visible test cases instead of chasing a perfect solution.

## Why pacing mode matters

Treating minute 80 of a 90-minute OA the same way you treat minute 5 wastes the clock. A simple timer-based mode switch keeps effort proportional to time remaining.

## Predict first

Use these thresholds on minutes remaining: under `15` is `rush`, under `45` (and at least `15`) is `pace`, `45` or more is `plan`.

Predict the mode for each remaining time:

- `minutes = 80` → ?
- `minutes = 44` → ?
- `minutes = 15` → ?
- `minutes = 5` → ?

## What to observe

- The boundaries are exclusive at the top of each band: exactly `15` minutes is `pace`, not `rush`; exactly `45` is `plan`, not `pace`.
- OAs are single-window and typically non-pausable — the mode should react to elapsed/remaining time, not to how "done" you feel.
- Partial credit exists per question, so `rush` mode still means submitting something, not giving up.
- The same three-mode idea generalizes to any timed multi-question test, not just HackerRank specifically.

## Quick challenge

You're at `16` minutes remaining with two unstarted questions. Which mode applies right now, and what does that suggest about whether to start a third approach on the current question?
