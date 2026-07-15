# Case Classifier

## Problem context
One Big-O label is incomplete when cost depends on **input shape**. Linear search is the teaching example for best / average / worst.

## Goal
Read a scenario id and print the case label plus Big-O for linear search.

## Lesson concepts practiced
- [ ] Worst-case guarantees matter for latency SLAs and adversarial inputs.
- [ ] Average-case needs an assumed distribution — “average” is not magic.
- [ ] Best-case alone is a weak argument for choosing an algorithm.

## Functional requirements
- [ ] `target-first` → `BEST O(1)`
- [ ] `target-missing` → `WORST O(n)`
- [ ] `target-uniform` → `AVERAGE O(n)`
- [ ] Unknown → `ERROR: unknown scenario`

## Non-functional requirements
- [ ] Do not run real searches — classify scenarios
- [ ] Exact output strings as above

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `target-first` → `BEST O(1)`
- [ ] `target-missing` → `WORST O(n)`
- [ ] `target-uniform` → `AVERAGE O(n)`
- [ ] `unknown` → `ERROR: unknown scenario`

## Example data

Input:
- `target-first`

Output:
- `BEST O(1)`

## Suggested plan (no solution)
1. Encode the lesson table for linear search.
2. Look up the scenario id from stdin.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add an early-exit-sum best-case scenario.
