# Projects — Code Quality and Maintainability

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- Leftover `console.log` calls are a maintainability smell even when the logic is correct
- Unresolved `TODO` comments signal a known, acknowledged gap
- `var` is a smell in modern JavaScript due to function-scoping and hoisting surprises

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-smell-scanner/

Read code-like lines from stdin and print `smell` if any line contains `var `, `console.log`, or `TODO`, otherwise `clean`.

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
