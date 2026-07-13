# OA Timer Mode

## Problem context

A practice-OA timer widget wants to nudge the candidate with a pacing mode based on minutes remaining, instead of just showing a countdown number.

## Goal

Read one integer number of minutes remaining from stdin and print the pacing mode: `rush`, `pace`, or `plan`.

## Lesson concepts practiced
- [ ] An OA runs in one fixed, typically non-pausable time window
- [ ] Effort should stay proportional to time remaining — plan early, pace mid-window, rush near the end
- [ ] Mode boundaries are exclusive at the top of each band (`15` is `pace`, `45` is `plan`)

## Functional requirements
- [ ] Read a single integer number of minutes remaining from stdin (one line)
- [ ] Minutes strictly below `15` → print `rush`
- [ ] Minutes from `15` up to but not including `45` → print `pace`
- [ ] Minutes `45` or more → print `plan`
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `mode(minutes)` helper is enough
- [ ] Error handling: assume the input is always a non-negative integer
- [ ] Output is a single line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not read or write any files besides stdin/stdout
- [ ] Input line may have surrounding whitespace — trim before parsing

## Acceptance criteria
- [ ] Minutes `5` → stdout `rush`
- [ ] Minutes `14` → stdout `rush`
- [ ] Minutes `15` → stdout `pace`
- [ ] Minutes `44` → stdout `pace`
- [ ] Minutes `45` → stdout `plan`
- [ ] Minutes `80` → stdout `plan`

## Example data

Sample stdin:
```text
16
```

Sample stdout:
```text
pace
```

Another run, stdin:
```text
80
```

Sample stdout:
```text
plan
```

## Suggested plan (no solution)
1. Read one line from stdin and parse it as an integer.
2. Implement `mode(minutes)` using the two threshold rules from the lesson.
3. Print the result plus a newline.
4. Mentally check both boundary values (`15`, `45`) and one value just below each from the acceptance criteria.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Add the number of unanswered questions as a second input and factor it into the mode
- [ ] Print a short one-line tip alongside the mode (e.g. "bank partial credit now" for `rush`)
