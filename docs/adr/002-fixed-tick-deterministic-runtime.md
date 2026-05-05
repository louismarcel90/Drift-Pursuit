# ADR 002 — Fixed Tick Deterministic Runtime

## Status

Accepted

---

## Context

DRIFT PURSUIT GRID is designed as a deterministic, replayable, explainable simulation system.

To support:

- exact replay
- scenario verification
- test reproducibility
- explainable outcomes
- evidence generation

the simulation must behave identically across executions when given the same inputs.

A variable time-step model (based on frame time or system clock) introduces non-determinism:

- different machines produce different timing
- CPU load affects simulation progression
- rendering speed influences state evolution
- replay becomes unreliable

This directly conflicts with:

- determinism guarantees
- replay integrity
- auditability
- test stability

---

## Decision

The simulation runtime will use a **fixed logical tick model**.

### Core Rules

1. Simulation time advances in discrete ticks.
2. Each tick represents a fixed logical duration.
3. Simulation state can only change during a tick.
4. Rendering does not control simulation time.
5. Input is processed at tick boundaries only.
6. Randomness must be seeded and deterministic.

### Default Tick Duration

```text
100ms per tick
```
