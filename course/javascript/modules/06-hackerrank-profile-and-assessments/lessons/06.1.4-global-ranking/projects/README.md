# Projects — Rank Tier Classifier

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- A smaller rank number is a stronger signal — rank works opposite to score
- Tier boundaries are inclusive on the low end (`100` and `1000` belong to the stronger tier)
- Most profiles fall into `open`, which is expected and not a weak signal by itself

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-rank-tier-classifier/

Classify a numeric contest rank into `top-100`, `top-1000`, or `open` using fixed thresholds.

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
