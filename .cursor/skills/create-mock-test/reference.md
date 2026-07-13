# Mock test reference

Companion to [`.cursor/rules/mock-test-structure.mdc`](../../rules/mock-test-structure.mdc) (auto-applies on `course/**/*-mock/**`) and [SKILL.md](SKILL.md).

## Disk layout vs catalog

Mock tests are **not** stored under `course/mock-tests/`. They are sibling folders of study modules:

```text
course/
  javascript/
    modules/
      01-javascript-fundamentals/          ← study module (course.modules[])
      01-javascript-fundamentals-mock/     ← mock test (course.mockTests[])
```

The catalog generator (`frontend/scripts/generate-static-catalog.mjs`) splits by folder id:

- `id` ends with `-mock` → `course.mockTests[]`
- otherwise → `course.modules[]`

Both still contribute to flattened `lessons`, `projects`, and `quizzes` arrays.

## Full folder tree

```text
course/<course>/modules/<NN>-<topic>-mock/
  README.md
  module.meta.json
  mock-test.meta.json
  .cursor-created.json
  lessons/
    01.1-test-instructions/
      README.md
      lesson.meta.json
      .cursor-created.json
    01.2-multiple-choice/
      README.md
      lesson.meta.json
      .cursor-created.json
      quiz/
        quiz.json
    01.3-coding-challenge/
      README.md
      lesson.meta.json
      .cursor-created.json
      projects/
        001-<slug>/
          README.md
          .cursor-created.json
          starter/
            index.js
            tests.json
            sample.input
```

## Metadata schemas

### `module.meta.json`

```json
{
  "id": "01-javascript-fundamentals-mock",
  "graphIndex": "01",
  "title": "JavaScript Fundamentals — Mock Test"
}
```

`graphIndex` aligns to the **source study module** (`01-javascript-fundamentals`).

### `mock-test.meta.json`

```json
{
  "id": "01-javascript-fundamentals-mock",
  "kind": "mock-test",
  "durationMinutes": 90,
  "passingScorePercent": 70,
  "sections": [
    { "lessonId": "01.1-test-instructions", "type": "instructions" },
    { "lessonId": "01.2-multiple-choice", "type": "quiz" },
    { "lessonId": "01.3-coding-challenge", "type": "coding" }
  ]
}
```

`sections[]` order is the UI navigation order. Each `lessonId` must exist and match `mockTestSection` on the lesson meta.

### Section lesson `lesson.meta.json`

| Lesson id | `mockTestSection` | `graphIndex` |
|-----------|-------------------|--------------|
| `01.1-test-instructions` | `instructions` | `01.1` |
| `01.2-multiple-choice` | `quiz` | `01.2` |
| `01.3-coding-challenge` | `coding` | `01.3` |

```json
{
  "id": "01.2-multiple-choice",
  "graphIndex": "01.2",
  "title": "Multiple Choice",
  "mockTestSection": "quiz",
  "status": "draft"
}
```

## HackerRank alignment

Mock tests are **fundamentals prep simulators**, not full clones of commercial HackerRank screenings. They match the **shape and skills** of common JS screenings; they intentionally omit several recruiter-configured platform behaviors.

### Section mapping

| HackerRank screening | Mock test section | Evaluation |
|---------------------|-------------------|------------|
| Landing / rules page | `01.1-test-instructions` | Not scored |
| Multiple-choice block | `01.2-multiple-choice` | Check answer per question; 1 pt each |
| Coding challenge (stdin/stdout) | `01.3-coding-challenge` | Run answer → Pass/Fail per `tests.json` case |

Timed session metadata: `durationMinutes` + `passingScorePercent` from `mock-test.meta.json`.

### What aligns with real HackerRank tests

| Area | Mock test | HackerRank |
|------|-----------|------------|
| Sectioned layout | Instructions → MCQ → coding (fixed trio) | Tests organized into named sections by topic/skill ([section-based testing](https://support.hackerrank.com/articles/5546852679-section-based-testing)) |
| Core question types | MCQ + stdin/stdout coding | Standard screening types among many others ([question types](https://candidatesupport.hackerrank.com/articles/9586502651-question-types-in-hackerrank)) |
| Coding I/O | Node.js reads stdin, writes stdout, exact output strings | Standard pattern ([STDIN/STDOUT](https://candidatesupport.hackerrank.com/articles/8758620864-using-stdin-for-inputs-and-stdout-for-outputs), [answer coding questions](https://candidatesupport.hackerrank.com/articles/9623161883-answer-coding-questions)) |
| Test-case grading | `tests.json` with `expectedStdout` / `expectedExitCode` | Exact output match per test case ([during-test FAQ](https://candidatesupport.hackerrank.com/articles/2859650598-frequently-asked-questions-during-the-test)) |
| MCQ topic scope | 4–10 conceptual questions from the source study module | Typical **Programming MCQ** block in JS screenings |
| Instructions upfront | Dedicated `01.1-test-instructions` | Rules and sample-test guidance on the login page |

### Intentional differences (do not “fix” without a product decision)

| Area | This repo | Real HackerRank |
|------|-----------|------------------|
| Test size | **1** coding project, **4–10** MCQs | Often **2–4** coding problems plus more MCQs; some tests add analytical/aptitude as section 1 ([sample instructions](https://www.hackerrank.com/test/cp5k1k290dp)) |
| Pass threshold | Fixed `passingScorePercent` (e.g. 70%) | Often **percentile/benchmark** scoring set per company, not a universal fixed % ([benchmarking](https://www.hackerrank.com/writing/how-hackerrank-benchmarks-passing-scores-for-senior-engineer-data-structures-tests)) |
| MCQ mechanics | Single-select only; 1 pt each; no penalty | May use **multi-select** and **negative marking** ([MCQ scoring](https://support.hackerrank.com/articles/2513748038-multiple-choice-questions)) |
| Coding evaluation | All `tests.json` cases visible to the student | Usually **sample + hidden** test cases; separate Run vs Submit ([during-test FAQ](https://candidatesupport.hackerrank.com/articles/2859650598-frequently-asked-questions-during-the-test)) |
| Section timing | `durationMinutes` shown in UI; no enforced countdown or section lock | Per-section timers; expired sections often **cannot be revisited** ([section-based testing](https://support.hackerrank.com/articles/5546852679-section-based-testing)) |
| Other formats | Not simulated | Project/repo tasks, frontend, SQL, DevOps, etc. ([question types](https://candidatesupport.hackerrank.com/articles/9586502651-question-types-in-hackerrank)) |

### Authoring intent

- **Do** mirror HackerRank for: section order, MCQ + coding mix, stdin/stdout Node problems, exact output matching, module-scoped fundamentals.
- **Do not** add a fourth section, split coding into multiple projects, or chase full platform parity (hidden tests, proctoring, percentile scoring) unless the product explicitly extends the mock-test feature.
- State in module/instructions README that this is **practice mode**: shorter than many production screens, friendlier MCQ scoring, all test cases visible.

### Official HackerRank references

| Topic | URL |
|-------|-----|
| Question types in tests | https://candidatesupport.hackerrank.com/articles/9586502651-question-types-in-hackerrank |
| Section-based testing (employer) | https://support.hackerrank.com/articles/5546852679-section-based-testing |
| STDIN / STDOUT | https://candidatesupport.hackerrank.com/articles/8758620864-using-stdin-for-inputs-and-stdout-for-outputs |
| Answer coding questions | https://candidatesupport.hackerrank.com/articles/9623161883-answer-coding-questions |
| During-test FAQ (timers, hidden cases, Run vs Submit) | https://candidatesupport.hackerrank.com/articles/2859650598-frequently-asked-questions-during-the-test |
| MCQ scoring and negative marking | https://support.hackerrank.com/articles/2513748038-multiple-choice-questions |
| Percentile / benchmark passing scores | https://www.hackerrank.com/writing/how-hackerrank-benchmarks-passing-scores-for-senior-engineer-data-structures-tests |
| Example public test layout (Analytical → MCQ → Programming) | https://www.hackerrank.com/test/cp5k1k290dp |

## Quiz contract

Same schema as study-lesson quizzes (`create-course-quiz`):

```json
{
  "id": "quiz",
  "title": "Fundamentals Multiple Choice",
  "lessonId": "01.2-multiple-choice",
  "graphIndex": "01.2",
  "questions": [
    {
      "id": "q1",
      "prompt": "…",
      "options": [{ "id": "a", "text": "…" }],
      "correctOptionId": "a",
      "explanation": "…"
    }
  ]
}
```

- **4–10** questions (inclusive).
- Questions must come from the assessed study module's topics.
- Distractors = realistic mistakes from those lessons.

## Coding project contract

Follows the PBL README shape from `create-course-project`, simplified for screening:

```markdown
# <Title>

## Problem
…

## Functional requirements
- [ ] Rule verifiable via stdin/stdout
- [ ] Another I/O rule

## Example
Input / Output blocks

## Constraints
- Node.js only
- No external libraries
```

### `tests.json` ↔ business rules

| Requirement type | Where it lives |
|------------------|----------------|
| stdin → stdout behavior | `tests.json` case with `expectedStdout` |
| Error messages / exit codes | `expectedStdout` + `expectedExitCode` |
| Code style, immutability, naming | README only |

**Coverage rule:** for each checkbox under `## Functional requirements` that describes observable I/O, add at least one scored case. Typical set:

1. `example` — mirrors README Example block
2. Edge cases — zeros, negatives, empty input, boundary values (one case each)
3. Error paths — invalid input → expected error output / exit code

### Starter bundle

| File | Role |
|------|------|
| `starter/index.js` | Incomplete scaffold imported into Delivery tab |
| `starter/tests.json` | All validation cases for **Run answer** |
| `starter/sample.input` | Manual CLI: `node starter/index.js < starter/sample.input` |

Scored case minimum fields:

```json
{
  "id": "example",
  "name": "Example from README",
  "stdin": "…",
  "expectedStdout": "…\n",
  "expectedExitCode": 0
}
```

Comparison: `expectedStdout` uses `trimEnd` on actual output.

## Frontend routes

```text
/course/:courseId/module/:moduleId/mock-test
/course/:courseId/module/:moduleId/mock-test/section/:sectionId
```

- Overview card: course page → **Mock tests** list (`course.mockTestsHeading`)
- `ModuleLayoutRoute` redirects `/module/<id>-mock` → `…/mock-test`
- Section rendering: `mock-test-experience/` feature
  - `instructions` → ReadmePanel
  - `quiz` → QuizHost (page layout)
  - `coding` → ProjectReader (drawer, Delivery tab, Run answer)

## `.cursor-created.json`

Add to every new folder:

```json
{
  "createdAt": "2026-07-10T02:30:00.000Z",
  "createdBy": "cursor-agent"
}
```

## Discovery commands

```bash
# List all mock tests
find course -path "*/modules/*-mock" -maxdepth 4 -type d

# Read mock-test config
cat course/javascript/modules/01-javascript-fundamentals-mock/mock-test.meta.json

# Count quiz questions
node -e "const q=require('./course/javascript/modules/01-javascript-fundamentals-mock/lessons/01.2-multiple-choice/quiz/quiz.json'); console.log(q.questions.length)"

# List scored test cases
node -e "const t=require('./course/javascript/modules/01-javascript-fundamentals-mock/lessons/01.3-coding-challenge/projects/001-clamp-utility/starter/tests.json'); console.log(t.cases.map(c=>c.id))"
```
