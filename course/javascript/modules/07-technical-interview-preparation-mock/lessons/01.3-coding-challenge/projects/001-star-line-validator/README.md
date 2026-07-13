# STAR Line Validator

## Problem context

A STAR behavioral answer needs all four parts — Situation, Task, Action, Result — actually filled in, not just present as empty placeholders. Before polishing the wording, it helps to check mechanically whether every slot has real content.

## Goal

Implement a program that reads exactly four stdin lines (one per STAR slot) and prints whether every slot is meaningfully filled.

## Lesson concepts practiced

- [ ] A complete STAR answer names all four parts explicitly — treat each stdin line as one STAR slot to check (07.2)
- [ ] Vague or empty content is a sign a step needs more detail, the same way a blank or too-short line here fails validation (07.2)

## Functional requirements

- [ ] Read exactly four lines from `stdin`, one for each STAR slot: Situation, Task, Action, Result.
- [ ] Trim each line before checking it.
- [ ] Every trimmed line must be **non-empty** and have length **≥ 3**.
- [ ] If all four lines pass both checks, print `valid`.
- [ ] If any line fails either check (empty after trim, or shorter than 3 characters), print `invalid`.
- [ ] Print a single word (`valid` or `invalid`) followed by a newline.

## Non-functional requirements

- [ ] Separate the validation check from the `console.log` / `process.stdout.write` call
- [ ] Keep the minimum-length rule (`3`) as a named constant, not a magic number

## Constraints

- [ ] Node.js only
- [ ] Exactly four lines of stdin input, one STAR slot per line

## Acceptance criteria

- [ ] Four filled STAR slots, each length at least 3, prints `valid`
- [ ] One blank STAR slot among the four prints `invalid`
- [ ] One slot with only 2 characters (for example Hi) prints `invalid`
- [ ] One whitespace-only STAR slot among the four prints `invalid`
- [ ] All four slots exactly 3 characters after trimming prints `valid` (boundary case)

## Example data

Sample stdin:

```
Deploy pipeline had a 30% failure rate
I was asked to find the root cause
I added logging and fixed a race condition
Failure rate dropped to under 2%
```

Sample stdout:

```
valid
```

## Suggested plan (no solution)

1. Read exactly four lines from stdin, collecting them in order.
2. Trim each line and check it is non-empty with length at least 3.
3. Print `valid` only if all four lines pass; otherwise print `invalid`.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)

## Extensions (optional)

- [ ] Print which specific STAR slot(s) failed instead of a single valid/invalid verdict.
