# Cycle Detection

> Graph index: `05.4`

## Context

A linked list (or any "next pointer" chain) either ends cleanly or loops back on itself forever. Naively walking the chain to check for a cycle can run forever if there **is** one. Floyd's **tortoise and hare** algorithm detects a cycle in O(n) time and O(1) extra space by moving two pointers at different speeds — no extra memory for a "visited" set required.

## Floyd's tortoise and hare

```js
// list represented as: next[i] is the index the node at i points to, or -1 for "end"
function hasCycle(next, start) {
  let slow = start;
  let fast = start;
  while (fast !== -1 && next[fast] !== -1) {
    slow = next[slow];           // moves one step
    fast = next[next[fast]];     // moves two steps
    if (slow === fast) return true; // they met -> cycle
  }
  return false; // fast reached the end -> no cycle
}
```

## The hash-set alternative

```js
// Simpler to reason about, but O(n) extra space
function hasCycleWithSet(next, start) {
  const seen = new Set();
  let node = start;
  while (node !== -1) {
    if (seen.has(node)) return true;
    seen.add(node);
    node = next[node];
  }
  return false;
}
```

## Predict first

For `next = [1, 2, 3, 1]` starting at index `0` (so `0 -> 1 -> 2 -> 3 -> 1 -> ...`), does `hasCycle` return `true` or `false`? Trace `slow` and `fast` step by step until they meet or `fast` falls off the end.

## What to observe

- If there is **no cycle**, `fast` (moving two steps at a time) always reaches `-1` before `slow` catches up — the loop ends via the `fast !== -1` check.
- If there **is** a cycle, `fast` can never "escape" past `slow` without lapping it — they are guaranteed to land on the **same index** within one full loop iteration.
- The hash-set version is easier to read but uses O(n) memory; Floyd's version uses O(1) extra memory by trading a set for a second pointer.
- Both approaches run in **O(n)** time — each node is visited a bounded number of times before a cycle is confirmed or the end is reached.
- A "cycle" here means some node's chain of `next` pointers revisits an earlier node — it does not have to loop back to the very start.

## Mini-exercise

Predict whether each `next` array (starting at index `0`) has a cycle:

```js
next = [1, 2, -1];      // 0 -> 1 -> 2 -> end        ?
next = [1, 2, 0];       // 0 -> 1 -> 2 -> 0 -> ...   ?
next = [-1];            // 0 -> end                  ?
next = [2, 2, 2];       // 0 -> 2 -> 2 -> 2 -> ...   ?
```
