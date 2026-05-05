# ADR 004 — Simplified Vehicle Dynamics Model

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs strong game feel.

A terminal pursuit simulator must feel responsive and readable, but it does not need full real-world automotive physics.

A highly realistic physics model would increase complexity, reduce readability, and slow down development without necessarily improving the player experience.

## Decision

The project will use a simplified deterministic vehicle dynamics model.

The model includes:

- acceleration
- braking
- passive drag
- heading changes
- handbrake drift
- drift recovery
- control level
- control states

The model intentionally avoids:

- tire friction simulation
- suspension modeling
- engine torque curves
- real-world aerodynamics
- continuous collision physics

## Consequences

### Positive

This keeps the system:

- responsive
- readable
- deterministic
- easy to test
- easy to tune
- suitable for terminal gameplay

### Negative

The simulation will not represent real vehicle physics with high fidelity.

### Mitigation

The model focuses on expressive arcade realism:

- speed has weight
- steering changes heading
- handbrake creates drift
- excessive drift reduces control
- recovery is visible and testable

## Final Principle

The vehicle should feel good before it feels realistic.
