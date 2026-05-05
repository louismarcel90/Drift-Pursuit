# ADR 015 — Scenario Definition And Validation

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs multiple mission modes and demo paths.

Hard-coding scenario behavior into the runtime would make the system harder to test, replay, extend, and explain.

The project needs a clean scenario boundary.

## Decision

The project will use typed scenario definitions.

Each scenario defines:

- identity
- mode
- difficulty
- deterministic seed
- total ticks
- tick duration
- traffic profile
- incident profile
- degraded profile
- scripted input

Scenario definitions must be validated before loading.

## Consequences

### Positive

This enables:

- deterministic mission packs
- repeatable demos
- scenario regression tests
- cleaner runtime
- future scenario authoring
- better GitHub showcase flows

### Negative

Scenario setup requires explicit configuration.

### Mitigation

Built-in scenarios provide immediate examples and a stable demo path.

## Final Principle

A scenario is not a script hidden in code.

A scenario is a governed simulation input.