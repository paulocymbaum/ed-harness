# Smell Scanner

## Problem context

Before submitting a solution in an interview or a pull request, it helps to run a quick automated pass that flags obvious leftover debugging artifacts and legacy patterns, so you catch them before a human reviewer does.

## Goal

Read lines of code-like text from stdin until end of input and print `smell` if any line contains a flagged pattern, otherwise print `clean`.

## Lesson concepts practiced
- [ ] Leftover `console.log` calls are a maintainability smell even when the logic is correct
- [ ] Unresolved `TODO` comments signal a known, acknowledged gap left in submitted code
- [ ] `var` is a smell in modern JavaScript due to function-scoping and hoisting surprises

## Functional requirements
- [ ] Read every line from stdin until EOF; each line is one line of code-like text
- [ ] Print `smell` if **any** line matches the pattern `var ` (case-insensitive), `console.log` (case-insensitive), or `TODO` (case-insensitive)
- [ ] Print `clean` only if **no** line matches any of those patterns
- [ ] Print exactly one output line (`smell` or `clean`)

## Non-functional requirements
- [ ] Readability and maintainability: express the three patterns as a single regular expression or a small array of patterns, not three separate duplicated loops
- [ ] Error handling: empty input (zero lines) should print `clean`
- [ ] Performance (when applicable): a single pass over the lines is sufficient

## Constraints
- [ ] Node.js only — no external libraries
- [ ] The `var ` check requires a trailing space (so it matches `var x = 1` but not, say, the substring inside another word)
- [ ] Matching must be case-insensitive for all three patterns (e.g. `Console.log`, `TODO`, `Var x` all count)

## Acceptance criteria
- [ ] Lines `function total(items) {` and `var sum = 0;` → stdout `smell` (matches `var `)
- [ ] Lines `function greet(name) {` and `console.log(name);` → stdout `smell` (matches `console.log`)
- [ ] Lines `function add(a, b) {` and `// TODO: validate inputs` → stdout `smell` (matches `TODO`)
- [ ] Lines `const sum = a + b;` and `return sum;` (no flagged pattern) → stdout `clean`
- [ ] Empty stdin (no lines) → stdout `clean`

## Example data

Input:
```text
function total(items) {
var sum = 0;
console.log("debugging", items);
// TODO: handle empty array
return sum;
}
```

Output:
```text
smell
```

Input:
```text
function add(a, b) {
const sum = a + b;
return sum;
}
```

Output:
```text
clean
```

## Suggested plan (no solution)
1. Read all stdin lines into an array (may be empty).
2. Build one case-insensitive regular expression covering `var `, `console.log`, and `TODO`.
3. Check whether any line matches the regular expression.
4. Print `smell` if a match was found, otherwise print `clean`.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] Print the 1-based line number of the first matching line alongside `smell`
- [ ] Also flag `debugger;` statements as a smell
