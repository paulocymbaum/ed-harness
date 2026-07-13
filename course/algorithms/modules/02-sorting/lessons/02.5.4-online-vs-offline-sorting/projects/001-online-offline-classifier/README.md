# Online Offline Classifier

## Problem context
Product requirements either wait for a complete batch (**offline**) or expose order while data still arrives (**online**).

## Goal
Read a scenario id and print `ONLINE` or `OFFLINE`. Unknown → `ERROR: unknown scenario`.

## Lesson concepts practiced
- [ ] Batch file sort → offline.
- [ ] Live leaderboard / stream top-k → online.
- [ ] External multi-pass merge of complete runs → offline in spirit.

## Functional requirements
- [ ] `batch-file` → `OFFLINE`
- [ ] `nightly-report` → `OFFLINE`
- [ ] `live-leaderboard` → `ONLINE`
- [ ] `stream-top-k` → `ONLINE`

## Non-functional requirements
- [ ] Exact labels
- [ ] Deterministic

## Constraints
- [ ] Node.js only
- [ ] No external libraries

## Acceptance criteria
- [ ] `batch-file` → `OFFLINE`
- [ ] `nightly-report` → `OFFLINE`
- [ ] `live-leaderboard` → `ONLINE`
- [ ] `stream-top-k` → `ONLINE`
- [ ] `rainbow` → `ERROR: unknown scenario`

## Example data

Input:
- `live-leaderboard`

Output:
- `ONLINE`

## Suggested plan (no solution)
1. Map scenario ids to ONLINE/OFFLINE.
2. Print lookup or error.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` + `sample.input`)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add `external-merge` → `OFFLINE`.
