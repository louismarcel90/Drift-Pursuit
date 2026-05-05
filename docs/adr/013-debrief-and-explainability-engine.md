# ADR 013 — Debrief And Explainability Engine

## Status

Accepted

## Context

DRIFT PURSUIT GRID should not only simulate a run.

It should explain the run.

A player should understand why a pursuit succeeded, degraded, or failed.

A reviewer should see that outcomes are traceable to events and reason codes.

## Decision

The project will include a dedicated debrief and explainability engine.

The engine consumes authoritative simulation state and produces a structured debrief summary.

The engine derives:

- outcome
- primary reason code
- headline
- explanation
- highlights
- key events
- collision count
- incident count
- final pursuit metrics

## Consequences

### Positive

This enables:

- better player learning
- stronger replay review
- future scoring integration
- future evidence generation
- explainable outcome storytelling
- Staff/Principal-level system framing

### Negative

The initial debrief model is rule-based and simple.

### Mitigation

The engine is isolated in `packages/debrief-engine`.

It can evolve toward richer coaching and evidence narratives without changing simulation runtime.

## Final Principle

A mission outcome is not complete until the system can explain it.