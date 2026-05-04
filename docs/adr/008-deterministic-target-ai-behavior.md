# ADR 008 — Deterministic Target AI Behavior

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs a target that feels alive.

However, the project also requires:

- deterministic replay
- explainable behavior
- testable AI decisions
- evidence-friendly mission outcomes

An uncontrolled or opaque AI model would weaken replay integrity and make outcomes harder to explain.

## Decision

The project will use a deterministic target AI behavior model.

The model derives target behavior from:

- target state
- pursuit state
- traffic context
- seeded deterministic RNG
- explicit AI config
- explicit AI profile

Each AI update must produce:

- updated target vehicle state
- decision kind
- decision reason
- updated RNG state

## Consequences

### Positive

This enables:

- reproducible target behavior
- explainable AI decisions
- stable tests
- debrief integration
- future scenario authoring
- future behavior profiles

### Negative

The initial AI model is simple and not yet route-aware.

### Mitigation

The module is isolated in `packages/ai-behaviors`.

It can evolve toward richer tactics without contaminating simulation core, rendering, or vehicle dynamics.

## Rejected Alternative

A purely random target movement model was rejected because it would make pursuit outcomes feel arbitrary and harm replay credibility.

## Final Principle

The target may surprise the player, but it must never surprise the system.