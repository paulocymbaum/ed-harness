# STAR Answer Formatter

## Problem context

Before a behavioral interview, candidates often jot down four rough lines for a story. A formatter that labels each line clearly (`Situation:`, `Task:`, `Action:`, `Result:`) makes it obvious at a glance whether any part is missing or too short.

## Goal

Read exactly four lines from stdin, in order (Situation, Task, Action, Result), and print each one prefixed with its STAR label.

## Lesson concepts practiced
- [ ] A complete STAR answer names all four parts explicitly: Situation, Task, Action, Result
- [ ] Each STAR letter answers a different question (context, responsibility, concrete steps, measurable outcome)
- [ ] Labeling each part makes it easy to spot when one is missing or too vague

## Functional requirements
- [ ] Read exactly 4 lines from stdin, in this fixed order: Situation, Task, Action, Result
- [ ] Print 4 output lines, each formatted as `<Label>: <text>` using the labels `Situation`, `Task`, `Action`, `Result`
- [ ] Preserve the original text of each line exactly (aside from trimming trailing whitespace/newline)
- [ ] Print the 4 labeled lines in the same S/T/A/R order they were read

## Non-functional requirements
- [ ] Readability and maintainability: pair labels with input lines using a single array of label names, not four repeated `console.log` statements with hardcoded strings
- [ ] Error handling: fewer than 4 lines may produce fewer labeled lines (no special requirement)
- [ ] Performance (when applicable): trivial for 4 lines of input

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Input is always 4 lines, one STAR component per line, in S/T/A/R order
- [ ] Do not reorder or reword the input text — only add the label prefix

## Acceptance criteria
- [ ] 4 lines `Pipeline kept failing`, `Find and fix the root cause`, `Added logging, found a race condition, rewrote the warm-up script`, `Failure rate dropped from 30% to under 2%` → 4 labeled output lines in that order
- [ ] Output line 1 starts with `Situation: `
- [ ] Output line 2 starts with `Task: `
- [ ] Output line 3 starts with `Action: `
- [ ] Output line 4 starts with `Result: `

## Example data

Input:
```text
Pipeline kept failing
Find and fix the root cause
Added logging, found a race condition, rewrote the warm-up script
Failure rate dropped from 30% to under 2%
```

Output:
```text
Situation: Pipeline kept failing
Task: Find and fix the root cause
Action: Added logging, found a race condition, rewrote the warm-up script
Result: Failure rate dropped from 30% to under 2%
```

## Suggested plan (no solution)
1. Read all stdin lines into an array.
2. Define the label order: `["Situation", "Task", "Action", "Result"]`.
3. Pair each label with the corresponding input line (by index) and format as `<Label>: <text>`.
4. Print each formatted line, one per line.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print a warning line if any of the 4 lines is empty or shorter than a few words
- [ ] Support an optional 5th line and label it `Reflection:`
