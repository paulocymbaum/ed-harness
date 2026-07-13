# Closure Multiplier

## Problem context

A billing tool needs a running multiplier that can only change through a fixed set of commands — never by direct assignment from outside code. This is the same closure-factory pattern used for private counters, applied to a multiplicative rather than additive accumulator.

## Goal

Read a `base` number and a sequence of commands from stdin. Maintain a private `factor` (starting at `1`) as state captured by a closure. `mul N` multiplies the factor by `N`; `get` prints `base * factor` on its own line.

## Lesson concepts practiced
- [ ] A closure factory returns functions that share access to private variables
- [ ] The captured variable (`factor`) is a live reference, not a snapshot — mutations from `mul` persist across later `get` calls
- [ ] Outside code cannot read or set `factor` directly, only through the exposed methods
- [ ] Each call to the factory creates independent, isolated state

## Functional requirements
- [ ] Read the first stdin line as the `base` number (integer, may be negative)
- [ ] Read every subsequent line as a command until EOF: `mul N` (where `N` is an integer) or `get`
- [ ] Build the multiplier using a closure factory function `createMultiplier(base)` — no module-level/global mutable variable for the factor
- [ ] The private `factor` starts at `1`
- [ ] `mul N` multiplies the private `factor` by `N` (no output)
- [ ] `get` prints `base * factor` on its own line
- [ ] Print one line per `get` command, in the order the commands were read

## Non-functional requirements
- [ ] Readability: implement `createMultiplier(base)` returning `{ mul, get }`
- [ ] Error handling: unknown commands may be ignored (no special requirement)
- [ ] Output has exactly one line per `get` command, each ending with a newline

## Constraints
- [ ] Node.js only — no external libraries
- [ ] Do not store `factor` on a global variable or module-level `let` — it must live inside the closure created by the factory
- [ ] Input lines may include trailing whitespace — trim before parsing commands
- [ ] `N` in `mul N` may be negative or zero

## Acceptance criteria
- [ ] Base `2`, commands `mul 3`, `get` → stdout `6`
- [ ] Base `5`, commands `get` (no `mul`) → stdout `5` (factor starts at `1`)
- [ ] Base `3`, commands `mul 2`, `mul 4`, `get`, `get` → stdout `24` then `24`
- [ ] Base `-2`, commands `mul -1`, `get` → stdout `2` (negative times negative)
- [ ] Base `10`, commands `mul 0`, `get` → stdout `0`
- [ ] No output line is printed for `mul` commands — the closure's private `factor` stays hidden between `get` calls

## Example data

Input:
```text
2
mul 3
get
```

Output:
```text
6
```

Input:
```text
3
mul 2
mul 4
get
get
```

Output:
```text
24
24
```

## Suggested plan (no solution)
1. Read all stdin lines; parse the first line as the `base` number.
2. Implement `createMultiplier(base)` returning `{ mul, get }` that close over a private `factor` variable starting at `1`.
3. Create one multiplier instance, then loop over the remaining command lines, parsing `mul N` (split on whitespace) or `get`.
4. Only print output when the command is `get`; call `mul(N)` for `mul` commands without printing.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Support a `reset` command that sets the factor back to `1`
- [ ] Support a `div N` command that divides the factor by `N` (guard against division by zero)
