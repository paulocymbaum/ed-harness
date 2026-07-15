# Behavioral (STAR Method)

> Graph index: `07.2`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/07-technical-interview-preparation/07.2-behavioral-star-method:README.md -->

## Context

Behavioral questions ("Tell me about a time you disagreed with a teammate") are graded on **structure**, not just content. The **STAR method** gives you that structure:

- **Situation** — the context: where, when, what was at stake.
- **Task** — your specific responsibility or goal in that situation.
- **Action** — what **you** concretely did (not "we").
- **Result** — the measurable or observable outcome, ideally with a number or a lesson learned.

Answers that skip **Task** or **Action** tend to sound like vague stories. Answers that skip **Result** leave the interviewer wondering if it worked.

## Predict first

A candidate answers: "Our team's deploy pipeline kept failing. I looked into it and eventually it got fixed." Which STAR letters are **missing**, and why does this answer feel incomplete?

## Explanation

That answer has a **Situation** (failing pipeline) but is missing a clear **Task** (was fixing it your responsibility, or did you volunteer?), a concrete **Action** ("I looked into it" is not specific — what did you actually do?), and a measurable **Result** ("eventually it got fixed" — by whom, how, how long, what changed?).

A stronger version:

- **Situation**: "Our deploy pipeline had a 30% failure rate for two weeks, blocking releases."
- **Task**: "As the on-call engineer, I was asked to find the root cause."
- **Action**: "I added logging around the flaky step, found a race condition in a cache warm-up script, and rewrote it to wait on a readiness check."
- **Result**: "Failure rate dropped to under 2%, and releases went from twice a week back to daily."

Notice each letter answers a **different question**: Situation = context, Task = your job, Action = your verbs, Result = the number/outcome.

## What to observe

- A complete STAR answer names all four parts explicitly, even briefly — don't let Action blur into Situation.
- **Action** should use "I", not "we" — the interviewer wants to know your specific contribution.
- **Result** is stronger with a concrete measure (percentage, time saved, count) or a clearly stated lesson.
- Vague verbs ("looked into it", "helped out") are a sign the Action step needs more detail.

## Quick challenge

Take this rough story and sort it into the four STAR labels, rewriting each line to be concrete: "There was a bug in production. I was the one who had to fix it since I wrote that code. I read the logs, found the null check was missing, added it, and shipped a hotfix. After that, the crash reports stopped completely."
