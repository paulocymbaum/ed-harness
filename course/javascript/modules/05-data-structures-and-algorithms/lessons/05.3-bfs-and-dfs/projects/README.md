# Projects — BFS and DFS

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- BFS uses a queue (FIFO) and visits nodes level by level
- A node is marked visited as soon as it is enqueued, to avoid infinite loops on cyclic graphs
- Both BFS and DFS run in `O(V + E)` — every vertex and edge is visited once

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-bfs-levels/

Print the BFS visit order of a graph (adjacency list) from a given start index, using a queue.

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
