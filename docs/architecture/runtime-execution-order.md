# Runtime Execution Order

## Purpose

This document defines the deterministic execution order for DRIFT PURSUIT GRID.

The runtime must execute phases in the same order on every tick.

This is required for:

- deterministic replay
- scenario verification
- debugging
- evidence generation
- explainable outcomes

## Fixed Tick Model

The simulation advances in fixed logical ticks.

The default tick duration is:

```text
100ms