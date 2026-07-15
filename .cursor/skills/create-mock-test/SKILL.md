---
name: create-mock-test
description: >-
  Scaffolds and authors HackerRank-style mock tests under
  course/<course>/modules/<NN>-<topic>-mock/. Enforces the fixed three-section layout
  (instructions, multiple choice, coding), activity counts, mock-test.meta.json contract,
  and tests.json coverage for every I/O-testable business rule. Use when the user asks to
  create, find, or update mock tests, simulados, or HackerRank-style screening assessments.
---

# Create Mock Test

**Cursor rule (authoring contract):** [`.cursor/rules/mock-test-structure.mdc`](../../rules/mock-test-structure.mdc) — applies automatically when editing `course/**/*-mock/**`. This skill implements that rule; follow both together.

HackerRank-style timed assessments live **inside each course**, not in a separate top-level folder.

## Find existing mock tests

```bash
# All mock-test modules on disk (id ends with -mock)
find course -path "*/modules/*-mock/mock-test.meta.json"

# Mock tests for one course
ls course/javascript/modules/*-mock/

# Catalog entries (after catalog:generate)
node -e "const c=require('./frontend/src/infrastructure/static/catalog.json'); console.log(c.courses.flatMap(x=>x.mockTests??[]).map(m=>m.id))"
```

| Where | What |
|-------|------|
| Disk | `course/<course>/modules/<NN>-<topic>-mock/` |
| Catalog | `course.mockTests[]` (split from `course.modules[]` by `-mock` suffix) |
| UI route | `/course/<courseId>/module/<moduleId>/mock-test` |

Reference module: `course/javascript/modules/01-javascript-fundamentals-mock/`

## HackerRank alignment

Mock tests simulate the **section shape and skills** of common HackerRank JS screenings (instructions → MCQ → stdin/stdout coding), not a full commercial clone.

| Aligned | Intentionally different |
|---------|-------------------------|
| Sectioned layout, MCQ + coding, exact stdout matching | Fixed 70% pass vs HackerRank percentile scoring |
| Node stdin/stdout problems scoped to the study module | 1 coding project vs 2–4 on many real screens |
| 4–10 conceptual MCQs from module topics | Single-select, no negative marking |
| Instructions landing before scored sections | No hidden test cases, section timers, or aptitude section |

Full mapping, official HackerRank doc links, and authoring intent: [reference.md § HackerRank alignment](reference.md#hackerrank-alignment).

When writing instructions READMEs, tell students this is **practice mode** — shorter and more transparent than production screenings.

## HackerRank activity contract (fixed)

Do **not** add a fourth section, reorder sections, or split coding into multiple projects.

| # | Section lesson | `mockTestSection` | Count | Scored |
|---|----------------|-------------------|-------|--------|
| 1 | `01.1-test-instructions` | `instructions` | 1 README | 0 |
| 2 | `01.2-multiple-choice` | `quiz` | 1 quiz, **4–10** questions | 1 pt each |
| 3 | `01.3-coding-challenge` | `coding` | **1** project (`001-<slug>`) | per `tests.json` case |

**Totals:** 3 sections · 1 quiz · 1 coding project · 0 extra activity types.

## Quick start

1. **Pick source module** — `graphIndex` in `module.meta.json` must match the study module being assessed (e.g. `01` → `01-javascript-fundamentals`).
2. **Scaffold** folder tree (see [Scaffold workflow](#scaffold-workflow)).
3. **Write content** — instructions README, `quiz/quiz.json`, coding project README + starter.
4. **Map business rules to tests** — every I/O-testable functional requirement → scored `tests.json` case.
5. **Validate** quiz + project; regenerate catalog.
6. **Spot-check** in dev UI.

## Scaffold workflow

Target path:

```text
course/<course>/modules/<NN>-<topic>-mock/
  module.meta.json
  mock-test.meta.json
  README.md
  .cursor-created.json
  lessons/
    01.1-test-instructions/
    01.2-multiple-choice/
    01.3-coding-challenge/
      projects/001-<slug>/
        starter/index.js
        starter/tests.json
        starter/sample.input
```

Copy templates from [templates/](templates/) and replace placeholders:

| Template | Destination |
|----------|-------------|
| `module.meta.json` | `module.meta.json` |
| `mock-test.meta.json` | `mock-test.meta.json` |
| `module-readme.md` | `README.md` |
| `lesson-instructions.meta.json` | `lessons/01.1-test-instructions/lesson.meta.json` |
| `section-instructions-readme.md` | `lessons/01.1-test-instructions/README.md` |
| `lesson-quiz.meta.json` | `lessons/01.2-multiple-choice/lesson.meta.json` |
| `lesson-coding.meta.json` | `lessons/01.3-coding-challenge/lesson.meta.json` |

Add `.cursor-created.json` to **every** new folder (module, each lesson, each project).

Naming: module id **must** end with `-mock` → `01-javascript-fundamentals-mock`.

## Content authoring

### Scope

- Pull topics from the **parent study module** linked by `graphIndex` — do not invent out-of-graph content.
- Use `find-topics-graph` / `graph/courses/<slug>.graph.txt` (with `--course`) to confirm lesson coverage.

### Section 1 — Instructions

- State duration, passing score, section order, Node.js-only constraint, no-refresh note.
- Brief **what to expect vs real HackerRank**: practice simulator; all test cases visible; no section lock-in (see [reference.md § HackerRank alignment](reference.md#hackerrank-alignment)).
- Not scored — orientation only.

### Section 2 — Multiple choice

- One `quiz/quiz.json` under `01.2-multiple-choice/quiz/`.
- **4–10** questions covering types, operators, control flow, APIs from the source module.
- Follow `create-course-quiz` schema; each question needs `explanation`.
- Short intro in `01.2-multiple-choice/README.md`.

### Section 3 — Coding challenge

- **Exactly one** project: `projects/001-<slug>/`.
- stdin/stdout problem scoped to module fundamentals (HackerRank pattern).
- Starter must **not** solve the problem.
- README `## Functional requirements` lists every business rule as checkboxes.

## tests.json — business rule coverage (required)

Every **I/O-testable** functional requirement must map to a scored case in `starter/tests.json`.

| README rule | tests.json |
|-------------|------------|
| Example I/O from README | `id: "example"` with matching `stdin` / `expectedStdout` |
| Edge case (zeros, negatives, bounds) | separate case per edge |
| Error output / non-zero exit | `expectedStdout` and/or `expectedExitCode` |
| Naming, immutability, style | README only — **not** in `tests.json` |

```json
{
  "cases": [
    {
      "id": "example",
      "name": "Example from README",
      "stdin": "3\n5\n",
      "expectedStdout": "8\n",
      "expectedExitCode": 0
    }
  ]
}
```

Rules:

- `stdin` piped to `process.stdin`; compare `expectedStdout` with `trimEnd`.
- At least **one** scored case (`expectedStdout` and/or `expectedExitCode`) so **Run answer** shows Pass/Fail.
- Cases without those fields are smoke-only (**Ran**, not scored).
- Keep `starter/sample.input` aligned with the README example.

**Run answer** (mock-test coding section + study projects) executes all cases and shows a Pass/Fail matrix — same engine as lesson PBL projects.

## Validation checklist

```
- [ ] Module id ends with -mock
- [ ] mock-test.meta.json sections[] matches 3 lesson ids and mockTestSection values
- [ ] Quiz has 4–10 questions with explanations
- [ ] Exactly 1 coding project (001-<slug>)
- [ ] Every I/O-testable functional requirement has a scored tests.json case
- [ ] .cursor-created.json in every new folder
- [ ] validate-quiz.mjs passes
- [ ] validate-project.mjs passes (no errors; fix unscored-tests warnings)
- [ ] catalog:generate run
- [ ] UI spot-check: /course/<courseId>/module/<moduleId>/mock-test
```

```bash
node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs \
  course/<course>/modules/<module>-mock/lessons/01.2-multiple-choice/quiz/quiz.json

node .cursor/skills/create-course-project/scripts/validate-project.mjs \
  course/<course>/modules/<module>-mock/lessons/01.3-coding-challenge/projects

cd frontend && npm run catalog:generate
```

## Related skills & docs

| Resource | Path |
|----------|------|
| **Cursor rule** (activity counts, evaluation) | [`.cursor/rules/mock-test-structure.mdc`](../../rules/mock-test-structure.mdc) |
| Quiz schema | [create-course-quiz](../create-course-quiz/SKILL.md) |
| Project / tests contract | [create-course-project](../create-course-project/SKILL.md) |
| Full schemas & HackerRank mapping | [reference.md § HackerRank alignment](reference.md#hackerrank-alignment) |
| Course hierarchy | `COURSE_STRUCTURE.md` |
