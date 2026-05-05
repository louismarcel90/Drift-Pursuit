# ADR 005 — Deterministic Traffic Engine

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs a living urban world.

Traffic is essential for:

- tension
- pursuit pressure
- risk management
- route reading
- replay variety
- mission storytelling

However, traffic cannot be random chaos.

The project requires replayability, explainability, and evidence-grade simulation behavior.

## Decision

Traffic will be generated and updated through a deterministic traffic engine.

Traffic behavior must be derived from:

- current tick
- authoritative state
- seeded deterministic RNG
- explicit traffic configuration

## Consequences

### Positive

This enables:

- reproducible traffic
- stable replay
- scenario testing
- traffic density tuning
- deterministic debugging
- future evidence generation

### Negative

Traffic behavior may initially feel simple.

### Mitigation

The engine is designed to evolve through clear modules:

- spawn policies
- movement policies
- density policies
- lane behavior
- congestion modeling
- driver behavior profiles

## Rejected Alternative

Using uncontrolled random spawning was rejected because it would break replay integrity and make outcomes harder to explain.

## Final Principle

Traffic should feel alive to the player and deterministic to the system.
