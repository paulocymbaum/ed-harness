# Projects — System Design (Scalability, CAP Theorem)

Practice exercises for this lesson. Run each project with:

```bash
node starter/index.js < starter/sample.input
```

Validate in the UI with **Delivery → Run answer** (`starter/tests.json`).

## What you should practice

- CP keeps Consistency + Partition tolerance and sacrifices Availability
- AP keeps Availability + Partition tolerance and sacrifices Consistency
- CA assumes no partitions and sacrifices Partition tolerance
- Naming the sacrificed guarantee (not the two kept) is the useful interview signal

## Folder conventions

- Projects live directly under `projects/` as `NNN-kebab-name/`
- Each project has `README.md` (PBL contract), `starter/index.js`, `starter/tests.json`, `starter/sample.input`, optional `solution/`
- Project numbers (`001`, `002`, …) are sequential within this lesson

## Project catalog

### 001-cap-trade-off-labeler/

Read a CAP pair (`CP`/`AP`/`CA`) from stdin and print the guarantee it sacrifices during a network partition.

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
