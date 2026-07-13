# Communication and Clarifying Questions

> Graph index: `07.3`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/07-technical-interview-preparation/07.3-communication-and-clarifying-questions:README.md -->

## Context

Interviewers deliberately leave coding prompts **underspecified** — "write a function that merges two lists" hides questions about duplicates, order, size limits, and input types. Jumping straight to code without asking is one of the most common ways strong coders lose points. A good clarifying question does two things: it removes a real ambiguity, and it signals what you're already thinking about (constraints, edge cases, example shapes).

## Predict first

A prompt says: "Write a function that returns the top K most frequent words in a list." Before writing any code, list at least three clarifying questions you would ask. Then compare: do your questions target **constraints** (input size, case sensitivity) or just restate the problem?

## Explanation

Weak clarifying questions restate the prompt ("so I need the top K words?") — they don't reduce ambiguity. Strong clarifying questions target concrete unknowns:

- **Constraints**: "What's the expected size of the input list — could it be millions of words?" "Should word comparison be case-sensitive?"
- **Ties**: "If two words have the same frequency, does order matter?"
- **Example**: "Can you confirm — for `["a","b","a"]` with K=1, the answer is `["a"]`?"

Notice the pattern: each good question either narrows a **constraint** (size, case, format) or checks understanding with a concrete **example**. Asking "can you give me an example input/output?" is often the single highest-value question, because it exposes assumptions on both sides immediately.

## What to observe

- A question that just repeats the prompt back doesn't move the conversation forward — target specifics (limits, ties, formats, edge cases).
- Confirming a concrete example ("so for `X` the output would be `Y`, correct?") catches misunderstandings before you write a single line of code.
- Asking too many questions before showing any thinking can stall — pair questions with a brief statement of your working assumption ("I'll assume case-insensitive unless you say otherwise").
- Narrating your assumptions out loud is a form of communication even when you don't ask a literal question.

## Quick challenge

For the prompt "Write a function that checks if a string is a palindrome," write two clarifying questions: one about a **constraint** (e.g., case, spaces, punctuation) and one that proposes a concrete **example** for the interviewer to confirm.
