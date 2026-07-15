<!-- cursor:teacher:add-explanation (deterministic) -->
<!-- marker:algorithms/02-sorting/02.5.4-online-vs-offline-sorting:README.md -->

# Online vs Offline Sorting

> Graph index: `02.5.4`

## Context

**Offline** sorting sees the whole collection before producing order (classic `sort` on an array). **Online** sorting must keep order as items **arrive** — think inserting into a sorted list/tree, priority queues, or streaming merges — without waiting for EOF if the consumer needs progressive order.

## Predict first

A UI shows top-10 scores as players finish. Is that closer to online or offline sorting?

## Explanation

Offline: load all rows → `sort` → done. Simple; needs all data resident (or external merge passes).

Online: each arrival updates a sorted structure (`insertion` into sorted array, balanced tree, heap for top-k). Latency to "current order" stays low; total work may exceed one offline sort if many inserts are naive `O(n)` each.

External sort (multi-pass merge of runs on disk) is offline in spirit but chunked for data larger than RAM.

## What to observe

- Online ≠ faster asymptotically; it means incremental availability.
- Top-k often uses a heap instead of full sort.
- Offline APIs are simpler when the batch is complete.

## Quick challenge

Is repeatedly calling `array.sort` after every push a good online strategy? Why or why not?
