# ADR 009 — Deterministic Incident Engine

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs dynamic urban events to keep missions tense and replayable.

However, incidents cannot be uncontrolled random surprises.

The project requires:

- deterministic replay
- explainable outcomes
- stable tests
- evidence-friendly simulation records

## Decision

The project will use a deterministic incident engine.

Incidents are derived from:

- current tick
- player position
- current incident state
- seeded deterministic RNG
- explicit incident config

Each created incident becomes authoritative simulation state.

## Consequences

### Positive

This enables:

- reproducible incidents
- scenario variety
- replay consistency
- future debrief integration
- future evidence generation
- future degraded-mode hooks

### Negative

Initial incident effects are limited.

Incidents are created and tracked but do not yet affect vehicle dynamics, traffic, or visibility.

### Mitigation

The incident engine is isolated in `packages/incident-engine`.

Future steps can connect incidents to:

- vehicle dynamics
- traffic behavior
- pursuit evaluation
- degraded systems
- scoring
- debrief

## Rejected Alternative

Uncontrolled random incidents were rejected because they would make outcomes harder to reproduce and explain.

## Final Principle

Incidents should surprise the player, not the replay system.
