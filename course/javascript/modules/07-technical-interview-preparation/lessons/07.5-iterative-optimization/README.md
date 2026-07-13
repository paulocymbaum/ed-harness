# Iterative Optimization

> Graph index: `07.5`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/07-technical-interview-preparation/07.5-iterative-optimization:README.md -->

## Context

Most coding interviews expect you to **narrate improvement**, not jump straight to the optimal solution. The typical arc is: get a **brute force** solution working first (even if slow), then talk through a **better** approach, then reach for the **optimal** one — explaining the complexity gain at each step. Interviewers weight this narration heavily: silently writing an optimal solution with no explanation often scores lower than talking through the same journey out loud.

## Predict first

For "find the two numbers in an array that sum to a target," what's the brute-force approach, what complexity does it have, and what single data structure gets you to the optimal approach? Answer before reading on.

## Explanation

- **Brute force**: check every pair with nested loops. Complexity **O(n²)** — correct, but slow for large inputs.
- **Better**: sort the array first, then use two pointers moving inward. Complexity **O(n log n)** — the sort dominates, but it's a real improvement and shows you know sorting unlocks two-pointer techniques.
- **Optimal**: use a hash map to record numbers seen so far; for each number, check if `target - number` was already seen. Complexity **O(n)** — one pass, constant-time lookups.

The narration matters as much as the code: "I'll start with the brute-force nested loop to make sure I understand the problem — that's O(n²). Then I'll improve it with a hash map to get to O(n), trading some space for time." Saying the complexity **out loud** at each step is exactly what interviewers listen for.

## What to observe

- Brute force → better → optimal is a narration pattern, not just a coding pattern — say the complexity at each step.
- "Better" doesn't have to be the theoretical best — showing an intermediate improvement (like sorting) demonstrates incremental thinking.
- The jump from O(n²) to O(n) often comes from trading space for time (e.g., a hash map) — name that trade-off explicitly.
- Landing directly on the optimal solution with no narration can score lower than talking through brute force → better → optimal, even if the final code is identical.

## Quick challenge

For "check if a string has any repeated characters," describe a brute-force approach and its complexity, then describe an optimal approach and its complexity. Name the data structure that gets you there.
