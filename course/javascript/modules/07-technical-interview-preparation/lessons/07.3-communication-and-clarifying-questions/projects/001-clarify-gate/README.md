# Clarify Gate

## Problem context

Before diving into code, a candidate should ask questions that target real ambiguities — constraints or concrete examples — not just restate the prompt. A quick automated check can flag whether a list of jotted-down questions clears that bar before the interview starts.

## Goal

Read lines from stdin until end of input, treating each line as one clarifying question. Print `ready` if the questions clear the bar, otherwise print `ask-more`.

## Lesson concepts practiced
- [ ] A clarifying question should target a real ambiguity, not restate the prompt
- [ ] Constraint questions (size, case, format, ties) and example-confirmation questions are the highest-value question types
- [ ] Checking for at least one real question mark and one constraint/example keyword is a simple proxy for "did the candidate ask something useful"

## Functional requirements
- [ ] Read every line from stdin until EOF; each line is one candidate question or note
- [ ] Print `ready` if **both** conditions hold: at least one line contains a `?` character, **and** at least one line contains the word `constraint` or `example` (case-insensitive, substring match)
- [ ] Print `ask-more` if either condition fails
- [ ] Print exactly one output line (`ready` or `ask-more`)

## Non-functional requirements
- [ ] Readability and maintainability: compute the two boolean conditions separately, then combine them, rather than one large nested condition
- [ ] Error handling: empty input (zero lines) should print `ask-more`
- [ ] Performance (when applicable): a single pass over the lines is sufficient

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Matching for `constraint`/`example` must be case-insensitive (e.g. `Example`, `CONSTRAINT` count)
- [ ] The `?` check and the keyword check can be satisfied by different lines — they don't need to be on the same line

## Acceptance criteria
- [ ] Lines `What's the max input size?` and `Can you confirm an example output?` → stdout `ready`
- [ ] Lines `I think this is a hard problem` and `Let's just start coding` (no `?`, no keyword) → stdout `ask-more`
- [ ] Lines `Is this a constraint on memory too` (no `?`) and `ok` → stdout `ask-more` (missing the `?`)
- [ ] Lines `Should I handle duplicates?` and `What about negative numbers?` (no `example`/`constraint` keyword) → stdout `ask-more`
- [ ] Empty stdin (no lines) → stdout `ask-more`

## Example data

Input:
```text
What's the max input size?
Can you confirm an example output?
```

Output:
```text
ready
```

Input:
```text
I think this is a hard problem
Let's just start coding
```

Output:
```text
ask-more
```

## Suggested plan (no solution)
1. Read all stdin lines into an array (may be empty).
2. Compute `hasQuestionMark` — true if any line includes `?`.
3. Compute `hasKeyword` — true if any line, lowercased, includes `constraint` or `example`.
4. Print `ready` only if both are true, otherwise print `ask-more`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Also accept the word `edge case` as a qualifying keyword alongside `constraint`/`example`
- [ ] Print the count of qualifying lines found instead of just `ready`/`ask-more`
