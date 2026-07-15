# Global Ranking

> Graph index: `06.1.4`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/06-hackerrank-profile-and-assessments/06.1.4-global-ranking:README.md -->

## Context

HackerRank computes a **global rank** (and a country rank) mostly from **contest performance** — rated contests where solving speed and difficulty affect a rating, similar to competitive programming ladders. A profile that only does untimed practice may have no meaningful rank, while an active contest participant can have a numeric rank like `#842` worldwide.

## Lower number = stronger signal

Rank works the opposite way from score: **smaller is better**. Rank `1` is the strongest possible signal; rank in the hundreds of thousands is a weak or unranked-in-practice signal.

- Rank is driven primarily by contest rating, not raw practice volume.
- A very low rank number (e.g. under 100) is rare and stands out sharply to reviewers.
- A rank in the low thousands still signals consistent, competitive participation.
- Beyond that, rank becomes noisy — most active users fall into a large "open" range where the exact number matters less than the fact that you're practicing at all.

## Why tiering the rank helps

Because raw rank numbers span from `1` to the millions, a tiered read (top tier / competitive tier / everyone else) is more useful for quick triage than the literal number.

## Predict first

Use these thresholds: rank `≤ 100` is `top-100`, rank `≤ 1000` (and above 100) is `top-1000`, anything else is `open`.

Predict the tier for each rank:

- `rank = 57` → ?
- `rank = 100` → ?
- `rank = 1000` → ?
- `rank = 15234` → ?

## What to observe

- The boundaries are inclusive on the low end: rank `100` is still `top-100`, rank `1000` is still `top-1000`.
- Tiers only make sense for **contest** rank — practice-only activity doesn't usually produce a competitive rank at all.
- A smaller rank number is always the better outcome; don't read it like a score.
- Most profiles fall in `open` — that's expected and not a weak signal by itself.

## Quick challenge

Two profiles show ranks `99` and `101`. Which tiers do they land in, and how much does one extra place change the classification?
