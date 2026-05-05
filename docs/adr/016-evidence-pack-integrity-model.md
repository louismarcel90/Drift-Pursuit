# ADR 016 — Evidence Pack Integrity Model

## Status

Accepted

## Context

DRIFT PURSUIT GRID targets deterministic replay, explainable outcomes, and Government/NASA-grade assurance thinking.

A simulation run should not only be playable.

It should be exportable as a structured proof artifact.

## Decision

The project will include an evidence engine.

The evidence engine will produce an evidence pack containing:

- scenario definition
- seed
- tick duration
- total ticks
- input log
- replay record
- replay verification
- final authoritative state
- debrief summary
- integrity manifest

The integrity manifest will include stable digests for:

- scenario
- input log
- event log
- final state
- debrief
- replay
- evidence pack

## Consequences

### Positive

This enables:

- audit-friendly runs
- reproducible demo proof
- stronger replay trust
- future export workflows
- future CI verification
- future evidence comparison

### Negative

Evidence packs add additional data volume and structure.

### Mitigation

The current pack is simple, deterministic, and text-friendly.

Future versions can add JSON export, schema versioning, and checkpoint manifests.

## Rejected Alternative

A simple “final score only” summary was rejected because it does not prove how the run happened.

## Final Principle

A serious simulation does not only produce an outcome.

It produces evidence.