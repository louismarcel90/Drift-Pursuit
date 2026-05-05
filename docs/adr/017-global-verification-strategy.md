# ADR 017 — Global Verification Strategy

## Status

Accepted

## Context

DRIFT PURSUIT GRID contains multiple deterministic engines:

- simulation runtime
- vehicle dynamics
- traffic
- pursuit
- collision
- target AI
- incidents
- degraded modes
- replay
- debrief
- evidence

Unit tests alone are not enough.

The project needs a global verification layer that proves the full chain works consistently.

## Decision

The project will include a dedicated `test-utils` package for global verification.

It will execute built-in scenarios and verify:

- deterministic final state
- stable final checksum
- replay verification
- evidence pack integrity
- meaningful event stream generation

Each package will own a local `vitest.config.ts`.

## Consequences

### Positive

This enables:

- stronger CI readiness
- clearer regression detection
- replay confidence
- evidence confidence
- better Staff/Principal review signal
- better NASA/Government assurance signal

### Negative

Global tests may be slower than unit tests.

### Mitigation

Global tests remain scenario-focused and deterministic.

They avoid unnecessary long-running loops.

## Final Principle

A deterministic system must be verified as a system, not only as isolated functions.
