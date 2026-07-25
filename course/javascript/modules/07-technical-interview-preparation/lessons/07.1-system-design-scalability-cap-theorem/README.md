# System Design (Scalability, CAP Theorem)

> Graph index: `07.1`

<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:javascript/07-technical-interview-preparation/07.1-system-design-scalability-cap-theorem:README.md -->

## Context

Junior/mid interviews rarely ask for a full distributed-systems design, but they often probe whether you can **reason about trade-offs** at a high level: "what happens when this gets 10x traffic?", "what if the database node goes down?". The **CAP theorem** is the compact vocabulary interviewers expect: a distributed system can only guarantee two of **Consistency**, **Availability**, and **Partition tolerance** at the same time.

- **Consistency (C)** — every read sees the latest write (or an error).
- **Availability (A)** — every request gets a (non-error) response, even if it's not the latest data.
- **Partition tolerance (P)** — the system keeps working when nodes can't talk to each other.

In real systems, network partitions **will** happen, so the practical choice is between **CP** (favor consistency, reject/queue requests during a partition) and **AP** (favor availability, serve possibly-stale data during a partition). **CA** only exists in the theoretical case of no partitions — in practice, choosing "CA" means you have **not actually planned for a partition**.

## Predict first

An interviewer says: "Our payments ledger must never show two different balances to two different users during a network split, even if that means some requests time out." Which guarantee is being **sacrificed**, and which pair (CP/AP/CA) does this system land in?

## Explanation

Map each pair to the guarantee it gives up when a partition happens:

| Pair | Keeps | Sacrifices | Typical use case |
|------|-------|------------|-------------------|
| **CP** | Consistency + Partition tolerance | **Availability** — some requests fail or block during a split | Payments, inventory counts, anything where stale data is worse than an error |
| **AP** | Availability + Partition tolerance | **Consistency** — reads may return stale data during a split | Social feeds, product catalogs, shopping carts, presence/"online" indicators |
| **CA** | Consistency + Availability | **Partition tolerance** — assumes the network never splits | Single-node databases, or a claim that doesn't survive real distributed conditions |

The payments example above is **CP**: it explicitly accepts failed/timed-out requests (giving up **availability**) to guarantee every visible balance is correct.

> [!TIP]
> Say the **sacrificed** guarantee out loud first ("I'm giving up availability"). Interviewers hear trade-off fluency faster than a memorized CP/AP label.

The interview move that matters is not memorizing the table — it's **naming the trade-off out loud**: "I'm choosing CP here because a stale balance is a business risk we can't accept; a slow response is more tolerable."

## What to observe

> [!NOTE]
> CAP is about behavior **during a network partition**, not normal operation — most of the time C and A both hold.

- "CA" is a red flag in an interview answer unless you explicitly justify why partitions are impossible (e.g., single machine, no replicas).
- Naming the **sacrificed** guarantee is more useful to an interviewer than naming the two you keep — it shows you understand the cost.
- Scalability questions ("what if traffic 10x's?") often hide a CAP question underneath ("what if the cache/replica falls behind?").

## Quick challenge

For each scenario, say which pair (CP/AP/CA) fits and which guarantee is sacrificed — then justify it in one sentence, the way you would out loud in an interview:

1. A live sports score ticker that must never go down, even if some viewers see a score that's a few seconds old.
2. A bank transfer service that must refuse a transfer rather than risk double-spending during a network split.
