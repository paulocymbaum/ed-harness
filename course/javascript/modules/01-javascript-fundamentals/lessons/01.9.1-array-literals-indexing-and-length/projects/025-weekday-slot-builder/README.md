# Weekday Slot Builder

## Problem context

You are building a tiny CLI that assembles a short weekday list for a schedule board. The first version of the tool must use only **array literals**, **indexing**, and **`.length`** — no array methods yet.

## Goal

Read five lines from stdin, build and update a days array with indexes and `.length`, and print first / last / joined list / new length as specified.

## Lesson concepts practiced
- [ ] Indexes start at `0`; last item is at `length - 1`
- [ ] Missing indexes are not needed here — every read is in range after the array is built
- [ ] Replace a middle slot with `arr[1] = value`
- [ ] Append with `arr[arr.length] = value` (grows `.length` by 1)

## Functional requirements
- [ ] Read exactly **5** lines from stdin (trailing newline stripped by the line reader; keep the text as-is otherwise)
- [ ] Build `days` as an array literal of the first three lines: `[line0, line1, line2]`
- [ ] Print `days[0]` (first day)
- [ ] Print `days[days.length - 1]` (last day)
- [ ] Set `days[1] = line3` (replace the middle day)
- [ ] Print the three current days joined by a single space
- [ ] Set `days[days.length] = line4` (append the fifth line)
- [ ] Print the new `days.length`
- [ ] Do **not** use `push`, `pop`, `shift`, `unshift`, `splice`, `concat`, `slice`, `map`, `filter`, or `for` / `for...of` to build or update the array

## Non-functional requirements
- [ ] Readability: small steps that match the lesson (literal → read → write → length)
- [ ] Error handling: fewer than 5 lines may leave the program incomplete (no special requirement)
- [ ] Each printed value is its own line ending with newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Use array literal + indexing + `.length` only for list construction/updates
- [ ] Do not print anything except the four required output lines

## Acceptance criteria
- [ ] Sample input (below) → stdout exactly:
  ```text
  Mon
  Wed
  Mon TueX Wed
  4
  ```
- [ ] First line of output is always `days[0]` after the initial three-item array
- [ ] Second line of output is always `days[days.length - 1]` before the middle replace
- [ ] Third line is the three days after middle replace, space-joined
- [ ] Fourth line is the numeric length after append (`4` for the sample)

## Example data

Input:
- `Mon`
- `Tue`
- `Wed`
- `TueX`
- `Thu`

Output:
```text
Mon
Wed
Mon TueX Wed
4
```

Input:
- `apple`
- `banana`
- `cherry`
- `blueberry`
- `date`

Output:
```text
apple
cherry
apple blueberry cherry
4
```

## Suggested plan (no solution)
1. Collect five stdin lines into variables (or a temporary list of strings — reading lines is fine).
2. Create `days` with an array literal of the first three.
3. Print first and last using `[0]` and `[length - 1]`.
4. Replace index `1`, print the joined three.
5. Append with `days[days.length] = …`, then print `.length`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Accept a sixth line that truncates with `days.length = 2` and prints the shortened list
- [ ] Support nested `[[day, note], …]` and print `days[0][0]` (nested access from the lesson)
