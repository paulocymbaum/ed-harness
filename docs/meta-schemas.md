# Meta JSON schemas

Each entity in the course hierarchy carries a `*.meta.json` file linking disk content to the graph (study content) or to the mock-test contract (simulated assessments).

Full layout and catalog behavior: [COURSE_STRUCTURE.md](../COURSE_STRUCTURE.md)

---

## course.meta.json

Location: `course/<course-slug>/course.meta.json`

```json
{
  "id": "javascript",
  "title": "JavaScript",
  "graphRootLabel": "JavaScript",
  "graphSlug": "javascript"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Kebab-case course slug (folder name) |
| `title` | yes | Human-readable course title |
| `graphRootLabel` | yes | Label of the graph root node |
| `graphSlug` | yes | Resolves `graph/courses/<graphSlug>.graph.txt` (convention: same as `id`) |
| `kind` | no | Optional discriminator; study courses omit this |

---

## module.meta.json

Location: `course/<course>/modules/<module-slug>/module.meta.json`

Used by **study modules** and **mock test modules**.

```json
{
  "id": "01-javascript-fundamentals",
  "graphIndex": "01",
  "graphNodeId": "n_abc123def0",
  "title": "JavaScript Fundamentals"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Module folder name |
| `graphIndex` | yes | Top-level section index (`01`–`07`) or aligned section for mocks |
| `graphNodeId` | yes* | Stable node id from graph JSON (*omitted on some mock scaffolds) |
| `title` | yes | Human-readable module title |

Mock test example: `id` must end with `-mock` (e.g. `01-javascript-fundamentals-mock`).

---

## mock-test.meta.json

Location: `course/<course>/modules/<NN-slug>-mock/mock-test.meta.json`

Required for mock test modules. Drives duration, passing score, and section order in the UI.

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

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Same as module folder name |
| `kind` | yes | Must be `"mock-test"` |
| `durationMinutes` | yes | Timed session length shown in UI. HackerRank duration is recruiter-configured ([before-test FAQ](https://candidatesupport.hackerrank.com/articles/6145743949-frequently-asked-questions-before-the-test)). |
| `passingScorePercent` | yes | Pass threshold shown in UI. Real HackerRank often uses percentile benchmarks, not a fixed % ([benchmarking](https://www.hackerrank.com/writing/how-hackerrank-benchmarks-passing-scores-for-senior-engineer-data-structures-tests)). |
| `sections` | yes | Ordered list; `lessonId` must match lesson folders; `type` must match `mockTestSection` |

HackerRank alignment (what matches vs intentional differences): [`.cursor/skills/create-mock-test/reference.md`](../.cursor/skills/create-mock-test/reference.md#hackerrank-alignment).

`sections[].type` values: `instructions` | `quiz` | `coding`.

If missing at catalog generation time, the generator infers sections from lessons that have `mockTestSection` set.

---

## lesson.meta.json

Location: `course/<course>/modules/<module>/lessons/<lesson-id>/lesson.meta.json`

### Study lesson

```json
{
  "id": "01.8.1-truthy-vs-falsy",
  "graphIndex": "01.8.1",
  "graphNodeId": "n_def456abc1",
  "title": "Truthy vs Falsy",
  "description": "Truthy and falsy values control if/while and logical operators in JavaScript.",
  "lesson_dependencies": [],
  "prerequisites": [],
  "status": "draft",
  "keywords": ["JavaScript", "truthy", "falsy", "truthy falsy"],
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "title": "Truthy and Falsy Values in JavaScript",
      "views": 1500000
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Lesson folder name (`<graphIndex>-<slug>`) |
| `graphIndex` | yes | Leaf node index from graph |
| `graphNodeId` | yes | Stable node id from graph JSON |
| `title` | yes | Human-readable lesson title |
| `description` | no | Brief one-paragraph summary of the lesson subject |
| `lesson_dependencies` | no | Array of concept term strings this lesson assumes (not graph indexes; distinct from `prerequisites`) |
| `prerequisites` | no | Array of graphIndex strings |
| `status` | no | `draft` \| `published` \| `composite` |
| `keywords` | no | Search terms for YouTube videos; **first entry must be the stack/course name** (e.g. `JavaScript` from `course.meta.json` title) |
| `videos` | no | Up to 2 YouTube resources: `{ url, title, views }[]`, ranked by keyword relevance (study lessons only) |

### Mock test section lesson

```json
{
  "id": "01.2-multiple-choice",
  "graphIndex": "01.2",
  "title": "Multiple Choice",
  "mockTestSection": "quiz",
  "status": "draft"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `mockTestSection` | yes* | `instructions` \| `quiz` \| `coding` (*required on mock section lessons) |
| `graphIndex` | yes | Synthetic section index (`01.1`, `01.2`, `01.3`) |
| `graphNodeId` | no | Not tied to graph leaves |

---

## quiz/quiz.json

Location: `lessons/<lesson-id>/quiz/quiz.json` (study or mock quiz section)

Not a `*.meta.json` file, but part of the lesson contract. Embedded into `catalog.json` on generate.

```json
{
  "id": "quiz",
  "title": "Strings Check",
  "description": "Optional summary.",
  "lessonId": "01.3.1-strings",
  "graphIndex": "01.3.1",
  "questions": [
    {
      "id": "q1",
      "prompt": "Question body (Markdown supported).",
      "options": [
        { "id": "a", "text": "Choice A" },
        { "id": "b", "text": "Choice B" }
      ],
      "correctOptionId": "a",
      "explanation": "Shown after Check answer."
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Quiz identifier (often `"quiz"`) |
| `title` | yes | Display title |
| `lessonId` | recommended | Must match parent lesson folder |
| `graphIndex` | recommended | Aligns with lesson meta |
| `questions` | yes | At least one question with ≥2 options |

Module-level quizzes (legacy): `course/<course>/modules/<module>/quiz/<NN>-<slug>.json`

---

## Project starter bundle

Location: `lessons/<lesson-id>/projects/<NNN>-<slug>/starter/`

| File | Schema | Role |
|------|--------|------|
| `tests.json` | `{ "cases": [{ "id", "name", "stdin", "expectedStdout?", "expectedExitCode?" }] }` | Drives **Run answer** in Delivery |
| `index.js` | Node.js scaffold | Student completes in Delivery tab |
| `sample.input` | plain text | Example stdin for manual runs |

Project README contract: [`.cursor/skills/create-course-project/reference.md`](../.cursor/skills/create-course-project/reference.md)
