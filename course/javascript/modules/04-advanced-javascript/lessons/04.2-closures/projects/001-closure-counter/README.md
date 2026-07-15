# Closure Counter

## Problem context

A CLI tool needs a counter whose current value cannot be tampered with directly — only through a fixed set of commands. This is a natural fit for a closure-based factory instead of a mutable global variable.

## Goal

Read a starting number and a sequence of commands from stdin. Maintain the count as private state captured by a closure, and print the current value every time a `get` command is processed.

## Lesson concepts practiced
- [ ] A closure factory returns functions that share access to private variables
- [ ] The captured variable (`count`) is a live reference, not a snapshot — mutations persist across calls
- [ ] Outside code cannot read or set `count` directly, only through the exposed methods
- [ ] Each call to the factory creates independent, isolated state

## Functional requirements
- [ ] Read the first stdin line as the starting number `N` (integer, may be negative)
- [ ] Read every subsequent line as a command: `inc`, `dec`, or `get`, one per line until EOF
- [ ] Build the counter using a closure factory function — no module-level/global mutable variable
- [ ] `inc` increases the private count by 1 (no output)
- [ ] `dec` decreases the private count by 1 (no output)
- [ ] `get` prints the current count on its own line
- [ ] Print one line per `get` command, in the order the commands were read

## Non-functional requirements
- [ ] Readability: implement a `createCounter(start)` factory returning `{ inc, dec, get }`
- [ ] Error handling: unknown commands may be ignored or throw (no special requirement)
- [ ] Output has exactly one line per `get` command, each ending with a newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not store the count on a global variable or module-level `let` — it must live inside the closure created by the factory
- [ ] Input lines may include trailing whitespace — trim before comparing commands

## Acceptance criteria
- [ ] Start `5`, commands `inc`, `inc`, `get` → stdout `7`
- [ ] Start `0`, commands `dec`, `get` → stdout `-1`
- [ ] Start `10`, commands `inc`, `dec`, `get`, `get` → stdout `10` then `10`
- [ ] Start `3`, commands `get`, `inc`, `get` → stdout `3` then `4`
- [ ] No output line is printed for `inc`/`dec` commands — the closure's private count stays hidden between `get` calls

## Example data

Input:
```text
5
inc
inc
get
```

Output:
```text
7
```

Input:
```text
10
inc
dec
get
get
```

Output:
```text
10
10
```

## Suggested plan (no solution)
1. Read all stdin lines; parse the first line as the starting number.
2. Implement `createCounter(start)` returning `{ inc, dec, get }` that close over a private `count` variable.
3. Create one counter instance, then loop over the remaining command lines, calling the matching method.
4. Only print output when the command is `get`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support a `reset` command that sets the count back to the original starting value
- [ ] Support `add <n>` / `sub <n>` commands that change the count by an arbitrary amount
