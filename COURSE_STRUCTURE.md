# Estrutura do ambiente de aprendizado

Este documento descreve a **hierarquia canônica** de conteúdo sob `course/`, o **modelo de catálogo** consumido pelo frontend e os **dois tipos de lesson** (estudo e simulado).

```
Course > Module > Lesson > (explanation, projects, quiz)
Course > MockTestModule > Section-lessons > (instructions | quiz | coding)
```

O grafo em `graph/courses/<courseSlug>.graph.txt` é a fonte de verdade para **módulos de estudo** daquele curso. Cada entidade de estudo no disco deve ter `graphIndex` em seu `*.meta.json`, validado contra o grafo do próprio curso (`course.meta.json` → `graphSlug`).

Schemas detalhados: [docs/meta-schemas.md](docs/meta-schemas.md)  
Navegação no frontend: [frontend/ARCHITECTURE-FRONT.md](frontend/ARCHITECTURE-FRONT.md)  
Rotas e camadas técnicas: [frontend/ARCHITECTURE.md](frontend/ARCHITECTURE.md)

---

## Visão geral

| Entidade | Pasta | Papel |
|----------|-------|-------|
| **Course** | `course/<course-slug>/` | Um curso por root do grafo (ex.: `javascript`) |
| **Study module** | `modules/<NN-slug>/` | Seção do grafo (`01`–`07`); lições de estudo |
| **Mock test module** | `modules/<NN-slug>-mock/` | Simulado HackerRank; **não** é lição do grafo |
| **Study lesson** | `lessons/<graphIndex>-<slug>/` | Folha do grafo; explicação + projetos + quiz opcionais |
| **Mock section lesson** | `lessons/01.{1,2,3}-…` | Uma das 3 seções fixas de um simulado |

Mock tests **pertencem ao mesmo curso** que os módulos de estudo (ex.: `course/javascript/`). O catálogo os expõe em listas separadas: `course.modules` e `course.mockTests`.

---

## Árvore de diretórios

```text
course/
  javascript/
    README.md
    course.meta.json
    modules/
      01-javascript-fundamentals/              # módulo de estudo
        README.md
        module.meta.json
        lessons/
          01.8.1-truthy-vs-falsy/
            README.md              # explicação (predict-first)
            lesson.meta.json
            .cursor-created.json
            projects/
              README.md
              001-cli-input-validator/
                README.md
                starter/index.js
                starter/tests.json
                starter/sample.input
            quiz/
              quiz.json
        quiz/                      # opcional — quiz de módulo (legado)
          01-fundamentals-check.json

      01-javascript-fundamentals-mock/           # simulado (id termina em -mock)
        README.md
        module.meta.json
        mock-test.meta.json
        lessons/
          01.1-test-instructions/    # mockTestSection: instructions
            README.md
            lesson.meta.json
          01.2-multiple-choice/      # mockTestSection: quiz
            README.md
            lesson.meta.json
            quiz/quiz.json
          01.3-coding-challenge/     # mockTestSection: coding
            README.md
            lesson.meta.json
            projects/001-sum-two-numbers/
              README.md
              starter/index.js
              starter/tests.json
              starter/sample.input
```

---

## Modelo de catálogo (`catalog.json`)

Gerado por `frontend/scripts/generate-static-catalog.mjs` a partir de `course/`.

### Course (hierarchy)

```ts
{
  id: string;
  title: string;
  structure: "hierarchy";
  modules?: Module[];        // pastas em modules/ cujo id NÃO termina em -mock
  mockTests?: MockTestModule[];  // pastas em modules/ cujo id termina em -mock
  lessons: Lesson[];         // flatten de todos os módulos + simulados
  projects: Project[];
  quizzes: Quiz[];
}
```

**Regra de split:** qualquer pasta `course/<course>/modules/<id>/` com `id` terminando em `-mock` vai para `mockTests[]`; as demais vão para `modules[]`. Ambas continuam contribuindo para os arrays flatten (`lessons`, `projects`, `quizzes`) para scoring e busca.

### Study module (`Module`)

| Campo | Origem |
|-------|--------|
| `id`, `title`, `graphIndex` | `module.meta.json` + README |
| `lessons[]` | subpastas de `lessons/` |
| `projects[]`, `quizzes[]` | agregados das lessons + `quiz/` no nível do módulo |

### Mock test module (`MockTestModule`)

Estende a forma de `Module` com `mockTest: MockTestMeta` (de `mock-test.meta.json`).

| Campo | Origem |
|-------|--------|
| `mockTest.sections[]` | `mock-test.meta.json` — ordem e tipo de cada seção |
| `lessons[]` | as 3 section-lessons; cada uma tem `mockTestSection` |
| `quizzes[]` | da lesson `01.2-multiple-choice/quiz/` |
| `projects[]` | da lesson `01.3-coding-challenge/projects/` |

### Lesson

| Campo | Study lesson | Mock section lesson |
|-------|--------------|---------------------|
| `id` | `<graphIndex>-<slug>` | `01.1-test-instructions`, etc. |
| `graphIndex` | folha do grafo | seção sintética (`01.1`, `01.2`, `01.3`) |
| `mockTestSection` | — | `instructions` \| `quiz` \| `coding` |
| `markdown` | `README.md` (explicação) | `README.md` (instruções ou intro curta) |
| `projects/` | opcional, PBL | só na seção `coding` |
| `quiz/` | opcional | só na seção `quiz` |

---

## Contrato por entidade (disco)

### Curso (`course/<slug>/`)

- `README.md` — visão geral do curso
- `course.meta.json` — `{ id, graphRootLabel, title }`

### Módulo de estudo (`modules/<NN-slug>/`)

- `README.md` — motivação, mapa de lessons, checklist agregado
- `module.meta.json` — `{ id, graphIndex, graphNodeId, title }`
- `lessons/` — pastas de lesson (folhas do grafo)
- `quiz/` (opcional) — quiz de módulo inteiro

### Simulado (`modules/<NN-slug>-mock/`)

- `README.md` — regras, duração, ordem das seções
- `module.meta.json` — `{ id, graphIndex, title }` (`graphIndex` alinha ao módulo fonte, ex. `01`)
- `mock-test.meta.json` — `{ id, kind: "mock-test", durationMinutes, passingScorePercent, sections[] }`
- `lessons/` — **exatamente 3** section-lessons (ordem fixa)

#### Seções do simulado (ordem fixa)

| # | Lesson id | `mockTestSection` | Conteúdo | Analogia HackerRank |
|---|-----------|-------------------|----------|---------------------|
| 1 | `01.1-test-instructions` | `instructions` | `README.md` only | Regras / landing ([instruções de teste](https://candidatesupport.hackerrank.com/articles/6145743949-frequently-asked-questions-before-the-test)) |
| 2 | `01.2-multiple-choice` | `quiz` | `quiz/quiz.json` | Bloco de múltipla escolha ([MCQ](https://support.hackerrank.com/articles/2513748038-multiple-choice-questions)) |
| 3 | `01.3-coding-challenge` | `coding` | `projects/<NNN>-<slug>/starter/` | Desafio stdin/stdout ([STDIN/STDOUT](https://candidatesupport.hackerrank.com/articles/8758620864-using-stdin-for-inputs-and-stdout-for-outputs)) |

#### Alinhamento com HackerRank real

Os simulados deste repositório reproduzem a **forma** e as **habilidades** de screenings comuns (seções fixas, MCQ conceitual, código Node com stdin/stdout e saída exata), mas são **modo prática** — mais curtos e transparentes que muitos testes comerciais.

| Alinhado | Diferença intencional |
|----------|----------------------|
| Layout em seções; MCQ + coding; grading por stdout exato | Um projeto de código vs 2–4 em muitos testes reais |
| Problemas fundamentais escopados ao módulo de estudo | Sem seção analítica/aptidão (comum em testes corporativos) |
| Instruções antes das seções pontuadas | `passingScorePercent` fixo vs percentil/benchmark no HackerRank |
| | MCQ só single-select, sem marcação negativa |
| | Todos os casos em `tests.json` visíveis (sem hidden cases) |
| | `durationMinutes` exibido; sem timer nem bloqueio por seção |

Referência completa, links oficiais e regras de autoria: [`.cursor/skills/create-mock-test/reference.md`](.cursor/skills/create-mock-test/reference.md#hackerrank-alignment).

Skill de scaffolding: [`.cursor/skills/create-mock-test/SKILL.md`](.cursor/skills/create-mock-test/SKILL.md)

### Lesson de estudo (`lessons/<graphIndex>-<slug>/`)

- `README.md` — explicação detalhada (predict-first, pitfalls, mini-desafio)
- `lesson.meta.json` — `{ id, graphIndex, graphNodeId, title, description?, lesson_dependencies?, prerequisites, status }`
- `projects/` (opcional) — projetos PBL escopados à lesson
- `quiz/` (opcional) — avaliação da lesson (`quiz/quiz.json`)

### Quiz (`quiz/quiz.json`)

Mesmo schema em lessons de estudo e na seção `quiz` de simulados:

```json
{
  "id": "quiz",
  "title": "…",
  "lessonId": "<lesson-folder-id>",
  "graphIndex": "…",
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

Validação: `node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs <path>`

---

## Padrão PBL para projetos

O `README.md` de cada projeto segue o contrato canônico: [`.cursor/skills/create-course-project/reference.md`](.cursor/skills/create-course-project/reference.md).

Numeração de projetos (`NNN`) é **sequencial dentro da lesson** (`001`, `002`, …).

### Arquivos em `starter/`

| Arquivo | Papel |
|---------|-------|
| `index.js` | Scaffold incompleto — o aluno completa na aba Delivery |
| `tests.json` | Casos de validação — **Run answer** na UI (matriz Pass/Fail) |
| `sample.input` | Exemplo de stdin para `node starter/index.js < starter/sample.input` |

O starter **não** resolve o problema; `tests.json` define a saída esperada. Usado em lessons de estudo e na seção `coding` de simulados.

### Visão da lesson (`projects/README.md`)

Template: [`.cursor/skills/create-course-project/templates/lesson-projects-readme.md`](.cursor/skills/create-course-project/templates/lesson-projects-readme.md)

---

## Frontend: rotas e shells

### Overview do curso

`/course/:courseId` → [`CourseOverviewRoute`](frontend/src/presentation/features/course-overview/CourseOverviewRoute.tsx)

- Lista **Modules** (`course.modules`)
- Lista **Mock tests** (`course.mockTests`) — separada, mesmo curso

### Módulo de estudo

```text
/course/:courseId/module/:moduleId                    → README + drawer de conteúdos
/course/:courseId/module/:moduleId/lesson/:lessonId → Explanation + drawer de atividades
  ?drawer=quiz&quiz=<id>
  ?drawer=project&project=<id>
  ?drawerTab=files|delivery
/course/:courseId/module/:moduleId?quiz=<id>        → quiz de módulo (página inteira)
```

Shells reutilizados: `ReadmePanel`, `QuizHost` (`page` | `drawer`), `ProjectReader` (`drawer`).

### Simulado

```text
/course/:courseId/module/:moduleId/mock-test
/course/:courseId/module/:moduleId/mock-test/section/:sectionId
```

- Acesso a partir do card na lista **Mock tests** do curso
- `ModuleLayoutRoute` redireciona `/module/<id>-mock` → `…/mock-test`
- Feature: [`mock-test-experience/`](frontend/src/presentation/features/mock-test-experience/)
- Seção `instructions` → `ReadmePanel`
- Seção `quiz` → `QuizHost` (`layout="page"`)
- Seção `coding` → `ProjectReader` (`layout="drawer"`, aba Delivery)

---

## Convenções de nomenclatura

- **Kebab-case** para pastas
- **Study lesson id**: `{graphIndex}-{slug}` → `01.8.1-truthy-vs-falsy`
- **Study module**: `NN-kebab-case` → `01-javascript-fundamentals`
- **Mock test module**: `NN-kebab-case-mock` → `01-javascript-fundamentals-mock`
- **Mock section lessons**: `01.1-test-instructions`, `01.2-multiple-choice`, `01.3-coding-challenge`
- **Projeto**: `NNN-kebab-case` → `001-cli-input-validator`

---

## Estrutura legada (compat)

Pastas flat `course/NN-*` (sem `course/<slug>/modules/`) ainda são suportadas pelo catálogo (`structure: "legacy"`). Novo conteúdo deve usar a hierarquia canônica. O frontend legacy usa abas flat + `ContentReaderDialog`.

---

## Pipeline e ferramentas

```text
course/  →  npm run catalog:generate  →  frontend/src/infrastructure/static/catalog.json
                                       →  courseCatalogStore (UI)
```

| Ação | Comando |
|------|---------|
| Scaffold do grafo | `node scripts/graph/scaffold-from-graph.mjs --course javascript "01.8.1"` |
| Scaffold módulo + folhas | `node scripts/graph/scaffold-from-graph.mjs --course javascript --module "01"` |
| Scaffold simulado | skill `create-mock-test` |
| Mapa grafo↔disco | `node scripts/graph/generate-content-map.mjs` |
| Validar lesson | `node scripts/validate-lesson.mjs --lesson <path>` |
| Validar quiz | `node .cursor/skills/create-course-quiz/scripts/validate-quiz.mjs <path>` |
| Validar projetos | `node .cursor/skills/create-course-project/scripts/validate-project.mjs <path>` |
| Gerar catálogo | `cd frontend && npm run catalog:generate` |

### Progresso e scores

- Chaves localStorage: `${courseId}:quiz:${lessonId|_}:${quizId}` e `${courseId}:project:${lessonId|_}:${projectId}`
- Arquivo agregado: `course/<course>/quiz/score.json`
- Plugins Vite em dev persistem entregas e scores no filesystem

---

## Ambiente JavaScript

- Node.js (LTS)
- `node starter/index.js` por projeto
- Aba **Delivery** no frontend para entregas e **Run answer** (`tests.json`)
