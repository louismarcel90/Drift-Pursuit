# Assurance Principles

## Principle 1 — Determinism

The system must guarantee that the same scenario, seed, and input sequence produce the same result.

This enables:

- exact replay
- debugging
- verification
- evidence generation
- scenario comparison

## Principle 2 — Authoritative State

The authoritative simulation state is the source of truth.

Render state is only a projection.

## Principle 3 — Reason-Coded Outcomes

Major outcomes must have explicit reason codes.

Examples:

- pursuit lost
- interception failed
- vehicle control lost
- mission failed
- collision penalty applied
- degraded mode activated

## Principle 4 — Invariants

Critical assumptions must be documented and tested.

Examples:

- vehicle speed cannot be negative
- completed missions cannot accept live commands
- collision detection must emit collision events
- pursuit loss must include a reason code
- replay divergence must be detectable

## Principle 5 — Safety Envelopes

The simulation must define safe and unsafe operating zones.

Examples:

- safe drift envelope
- critical turn speed
- minimum interception distance
- severe collision threshold
- control loss threshold

## Principle 6 — Degraded Modes

The system must support controlled degradation.

Examples:

- partial HUD failure
- intermittent target indicator
- delayed event feed
- reduced visibility
- simulated input drop
- traffic inconsistency scenario

## Principle 7 — Evidence Generation

Every mission should be capable of producing an evidence pack containing:

- scenario id
- scenario digest
- seed
- input log digest
- key event digest
- mission result
- score summary
- engine version
- replay checksum

## Principle 8 — Auditability

A reviewer should be able to understand why a mission succeeded or failed without reading the entire codebase.