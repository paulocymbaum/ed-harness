# Projects — OA Timer Mode

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- An OA runs in one fixed, typically non-pausable time window
- Effort should stay proportional to time remaining: plan early, pace mid-window, rush near the end
- Mode boundaries are exclusive at the top of each band (`15` is `pace`, `45` is `plan`)

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-oa-timer-mode/

Classify minutes remaining in an OA window into a pacing mode: `rush`, `pace`, or `plan`.

## PBL contract checklist

Each project README must include (English headers):

- Problem context
- Goal
- Lesson concepts practiced
- Functional requirements
- Non-functional requirements
- Constraints
- Acceptance criteria
- Example data (if applicable)
- Suggested plan (no solution)
- Deliverables
- Extensions (optional)
