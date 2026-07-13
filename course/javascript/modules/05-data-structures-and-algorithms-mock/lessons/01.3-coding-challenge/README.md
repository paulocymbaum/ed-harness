# Coding Challenge

Implement **Sliding Window Max Sum** — find the maximum sum of any contiguous window of a fixed length within an array read from stdin.

The program reads a line of space-separated integers, then a window size `k`. If `k` is invalid (`k < 1` or `k > n`, where `n` is the array length), print `ERROR`. Otherwise, print the maximum sum over all contiguous windows of length `k`, computed with an O(n) sliding window instead of recomputing each window's sum from scratch.

Open the starter file, implement `maxWindowSum(numbers, k)`, and use **Run answer** to verify all test cases.
