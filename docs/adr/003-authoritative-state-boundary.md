# ADR 003 — Authoritative State Boundary

## Status

Accepted

## Context

A terminal game can easily mix rendering, input, movement, collision, mission state, and scoring into one mutable loop.

That design would make replay, testing, and evidence generation fragile.

DRIFT PURSUIT GRID needs a stronger architecture because the project targets deterministic replay, explainable outcomes, degraded modes, and evidence-grade debriefing.

## Decision

The project will use an authoritative simulation state as the only trusted source of truth.

The renderer will consume projected state.

The simulation runtime will update authoritative state only through approved pure reducers.

## Consequences

### Positive

This enables:

- deterministic replay
- testable state transitions
- clear invariant checks
- scenario verification
- explainable debriefs
- evidence generation
- renderer independence

### Negative

This adds structure and ceremony compared to a simple terminal game loop.

### Mitigation

The state store will stay small, explicit, typed, and easy to test.

## Final Principle

The terminal displays the world.  
It does not define the world.
