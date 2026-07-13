# Coding Challenge

Implement **Closure Multiplier** — a private multiplier factor built with a closure factory, driven by commands read from stdin.

The program reads a `base` number on the first line, then a sequence of commands (`mul N` or `get`) until end of input. `mul N` multiplies a hidden `factor` (starting at `1`) by `N`; `get` prints `base * factor` on its own line. The factor must live inside a closure — no module-level mutable variable.

Open the starter file, implement `createMultiplier(base)`, and use **Run answer** to verify all test cases.
