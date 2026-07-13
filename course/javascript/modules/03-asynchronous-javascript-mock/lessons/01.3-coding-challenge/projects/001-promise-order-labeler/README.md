# Promise Order Labeler

## Problem context

Debugging async code often starts with predicting *when* each piece of work actually runs — synchronous code first, then queued promise reactions, then timers — rather than the order it was written in.

## Goal

Implement `classifyTokens(tokens)` that groups scheduling tokens by kind, read a line of space-separated tokens from `stdin`, and print them regrouped in the event-loop execution order: sync, then microtasks, then macrotasks.

## Lesson concepts practiced

- [ ] The event loop runs all synchronous code before draining any queue.
- [ ] The microtask queue (promises) fully drains before the next macrotask (timers/callbacks) runs.
- [ ] Within a queue, tasks keep their original relative (FIFO) order.

## Functional requirements

- [ ] Implement `function classifyTokens(tokens)` that **returns** an object with `sync`, `micro`, and `macro` arrays, each preserving the tokens' original encounter order (no `console.log` inside).
- [ ] Read one line from `stdin` containing space-separated tokens, each one of the literal words `sync`, `micro`, or `macro`.
- [ ] If any token is not exactly `sync`, `micro`, or `macro` → print `ERROR: invalid token`.
- [ ] Otherwise print every `sync` token first (one per line, in encounter order), then every `micro` token, then every `macro` token.
- [ ] Each printed token is the literal word (`sync`, `micro`, or `macro`), not an index.

## Non-functional requirements

- [ ] Separate computation (`classifyTokens`) from I/O (`console.log` / `process.stdout.write`)
- [ ] Do not use real `setTimeout`/`Promise` scheduling — this is a conceptual regrouping exercise, not a live event-loop simulation

## Constraints

- [ ] Node.js only
- [ ] Tokens are separated by single spaces on one line; assume no leading/trailing whitespace issues beyond a trailing newline

## Acceptance criteria

- [ ] `sync micro sync macro` → `sync`, `sync`, `micro`, `macro` (one per line)
- [ ] `sync sync sync` → `sync`, `sync`, `sync`
- [ ] `macro micro sync` → `sync`, `micro`, `macro`
- [ ] `sync macro micro macro sync micro` → `sync`, `sync`, `micro`, `micro`, `macro`, `macro`
- [ ] `sync foo macro` → `ERROR: invalid token`

## Example data

Input:

```
sync micro sync macro
```

Output:

```
sync
sync
micro
macro
```

## Suggested plan (no solution)

1. Read one line from stdin and split it into tokens.
2. Implement `classifyTokens` to bucket each token into `sync`, `micro`, or `macro` arrays, throwing on an unrecognized token.
3. In `main`, catch the thrown error and print `ERROR: invalid token`.
4. Otherwise print `sync` tokens, then `micro` tokens, then `macro` tokens, one per line.

## Deliverables

- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)

## Extensions (optional)

- [ ] Support a fourth token kind, `microMicro`, that represents a microtask scheduled from inside another microtask, and still prints within the `micro` group.
