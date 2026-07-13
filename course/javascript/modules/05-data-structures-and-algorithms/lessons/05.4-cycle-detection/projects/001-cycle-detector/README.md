# Cycle Detector

## Problem context

A workflow engine represents each step as pointing to the index of its "next" step. A misconfigured workflow can accidentally point back to an earlier step, creating an infinite loop when executed. Before running the workflow, the engine must detect whether following the chain from the first step ever revisits an earlier step.

## Goal

Read a `next`-pointer chain from stdin (starting at index `0`) and print `cycle` if following it revisits an earlier node, or `acyclic` if it reaches the end cleanly.

## Lesson concepts practiced
- [ ] Following `next` pointers can loop forever if the chain revisits an earlier node — naive walking must be avoided.
- [ ] Floyd's tortoise-and-hare uses two pointers moving at different speeds (`slow` one step, `fast` two steps) to detect a cycle in `O(n)` time and `O(1)` extra space.
- [ ] A cycle exists whenever the chain revisits any earlier node — not necessarily the very first node.

## Functional requirements
- [ ] Read one line: space-separated integers representing `next[i]` for each index `i` (a value of `-1` means "end")
- [ ] Start following the chain at index `0`
- [ ] Detect whether the chain ever revisits a node before reaching `-1`
- [ ] Print `cycle` if a cycle is detected, `acyclic` otherwise
- [ ] Print exactly one line of output ending with a newline

## Non-functional requirements
- [ ] Readability: a single `hasCycle(next, start)` helper is enough
- [ ] Performance: implement in `O(n)` time (a hash-set walk or Floyd's tortoise-and-hare both qualify)
- [ ] Error handling: malformed input may throw (no special requirement)

## Constraints
- [ ] Node.js only — no external libraries
- [ ] The chain always starts at index `0`
- [ ] `-1` marks the end of the chain; any other value is a valid index into the `next` array
- [ ] Do not rely on the chain visiting every index — some indices may be unreachable from `0`

## Acceptance criteria
- [ ] Kind `chain that ends cleanly at -1` → stdout `acyclic`
- [ ] Kind `chain that loops back to an earlier node` → stdout `cycle`
- [ ] Kind `single node that points to itself` → stdout `cycle`
- [ ] Kind `chain of length one that ends immediately` → stdout `acyclic`

## Example data

Input:
```text
1 2 3 1
```

Output:
```text
cycle
```

Input:
```text
1 2 -1
```

Output:
```text
acyclic
```

## Suggested plan (no solution)
1. Read the line and split it into an array of numbers: `next`.
2. Implement `hasCycle(next, start)` using either the hash-set walk or Floyd's tortoise-and-hare from the lesson.
3. Print `cycle` or `acyclic` based on the result, plus a newline.
4. Trace all four acceptance criteria examples by hand before running the tests.

## Deliverables
- [ ] Code in `starter/` (`index.js` scaffold + `tests.json` validation cases + `sample.input` example stdin)
- [ ] (Optional) reference in `solution/`

## Extensions (optional)
- [ ] If a cycle exists, also print the index where the cycle begins
- [ ] Print the length of the cycle (number of nodes in the loop)
