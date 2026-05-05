# ADR 001 — Terminal-Native Deterministic Simulation

## Status

Accepted

## Context

DRIFT PURSUIT GRID started from the idea of a fun terminal pursuit game.

To reach a higher engineering standard, the project must avoid becoming a simple random arcade prototype.

The system needs to support:

- deterministic simulation
- exact replay
- explainable outcomes
- evidence generation
- structured scenarios
- clean testing boundaries

At the same time, the project must preserve the immediate fun and visual identity of a terminal-native game.

## Decision

DRIFT PURSUIT GRID will be built as a terminal-native deterministic simulation platform.

The terminal client will be a projection layer, not the source of truth.

The simulation will be based on:

- fixed ticks
- seeded randomness
- authoritative state
- typed commands
- typed events
- replayable input logs
- reason-coded outcomes

## Consequences

### Positive

This decision enables:

- exact replay
- scenario testing
- deterministic debugging
- clear architecture
- stronger documentation
- better interview storytelling
- higher credibility with FAANG and NASA/Government reviewers

### Negative

This increases initial architecture complexity.

The project requires more discipline than a simple terminal game.

### Mitigation

The project will preserve fun by keeping:

- responsive input
- minimal HUD
- expressive vehicle dynamics
- readable drift
- fast demo mode
- showcase scenarios

## Final Principle

The system must feel like a game to the player and behave like a disciplined simulation platform under the hood.
