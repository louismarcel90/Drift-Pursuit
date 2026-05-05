# ADR 012 — Replay Verification Model

## Status

Accepted

## Context

DRIFT PURSUIT GRID targets deterministic replay and evidence-grade simulation behavior.

A replay system that only replays visuals is not sufficient.

The system needs to verify that the simulation result is reproduced exactly.

## Decision

The project will implement replay verification using replay records and final state checksums.

A replay record includes:

- scenario id
- seed
- tick duration
- total ticks
- input log
- expected final checksum

A replay is verified when the replayed final checksum matches the expected final checksum.

## Consequences

### Positive

This enables:

- deterministic verification
- debugging support
- future evidence packs
- debrief trustworthiness
- scenario regression tests
- replay divergence detection

### Negative

A final checksum only proves final-state equality.

It does not yet prove every intermediate tick matched.

### Mitigation

Future replay upgrades will add:

- checkpoint checksums
- per-tick divergence detection
- step replay
- replay timeline inspection

## Rejected Alternative

Visual-only replay was rejected because it cannot prove simulation integrity.

## Final Principle

Replay is not animation.

Replay is verification.
