# ADR 014 — Degraded Modes And Fault Injection

## Status

Accepted

## Context

DRIFT PURSUIT GRID targets more than arcade gameplay.

The project needs to demonstrate assurance thinking, controlled degradation, replayability, and explainable failure behavior.

Without explicit degraded modes, system failures would be either absent or informal.

That would weaken the NASA/Government-grade positioning.

## Decision

The project will include a dedicated degraded mode and fault injection engine.

The engine will derive degraded modes from:

- current tick
- current degraded mode state
- seeded deterministic RNG
- explicit fault injection rules

Each activated degraded mode must include:

- degraded mode kind
- status
- activation tick
- recovery tick
- fault code

## Consequences

### Positive

This enables:

- controlled failure scenarios
- replayable degraded missions
- future evidence packs
- future debrief explanations
- future scoring penalties
- stronger assurance documentation

### Negative

Initial degraded modes are stateful signals only.

They do not yet fully affect every subsystem.

### Mitigation

The engine is isolated in `packages/degraded-mode-engine`.

Future steps can connect degraded-mode state to rendering, input, pursuit, traffic, scoring, and evidence without changing the simulation architecture.

## Rejected Alternative

Implicit failures hidden inside individual modules were rejected because they would make fault behavior harder to test, replay, and explain.

## Final Principle

Failure must be modeled deliberately.

A degraded system is still a system.
