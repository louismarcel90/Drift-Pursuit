# ADR 006 — Pursuit Lock And Pressure Model

## Status

Accepted

## Context

DRIFT PURSUIT GRID must feel like a pursuit, not just movement on a grid.

The player needs readable tactical feedback:

- am I tracking the target?
- am I gaining pressure?
- am I close enough to intercept?
- why did I lose the target?

## Decision

The project will use a pursuit lock and pressure model.

The model includes:

- target distance
- lock acquisition threshold
- lock loss threshold
- pursuit pressure
- intercept window
- reason-coded loss

## Consequences

### Positive

This enables:

- readable chase tension
- explainable pursuit loss
- score integration
- debrief generation
- deterministic tests
- future target AI integration

### Negative

The current model is simplified.

It does not yet include line-of-sight, road topology, or target tactics.

### Mitigation

The model is isolated in `packages/pursuit-engine`, so it can evolve without touching vehicle dynamics or rendering.

## Final Principle

A pursuit must be felt by the player and explained by the system.