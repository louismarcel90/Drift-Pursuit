# System Invariants

## Core Determinism Invariant

Same scenario + same seed + same input log must produce the same final checksum.

## State Invariants

- Tick cannot be negative.
- Player speed cannot be negative.
- Player control level must stay between 0 and 1.
- Lost pursuit must include a reason code.
- Renderer must not mutate authoritative state.
- Replay verification must compare expected and actual checksum.
- Evidence pack must include scenario, input, replay, final state, debrief, and integrity manifest.

## Collision Invariants

- A detected collision must emit a collision event.
- Collision must produce kind, severity, speed penalty, and control penalty.

## Degraded Mode Invariants

- Activated degraded modes must include a fault code.
- Recovered modes must not remain active.
- Fault injection must be deterministic.

## Evidence Invariants

- Evidence pack digest must be stable for identical input artifacts.
- Different scenarios should produce different evidence pack digests.
