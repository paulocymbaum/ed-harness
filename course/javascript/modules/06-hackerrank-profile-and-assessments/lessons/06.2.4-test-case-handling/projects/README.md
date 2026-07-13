# Projects — Edge Case Flag Reporter

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- HackerRank grades per test case, and hidden cases often target empty, zero, negative, and single-element inputs
- Only the four known category tokens (`empty`, `zero`, `neg`, `single`) are recognized — everything else is noise
- These four categories form a reusable pre-submission checklist for almost any problem

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-edge-case-flag-reporter/

Report which recognized edge-case category tokens (`empty`, `zero`, `neg`, `single`) appear in a line of input, sorted and de-duplicated.

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
