# ADR 011 — Input As Typed Commands

## Status

Accepted

## Context

DRIFT PURSUIT GRID needs responsive terminal controls.

However, direct keyboard handling inside the simulation would mix input, gameplay logic, state mutation, and rendering.

That would weaken:

- deterministic replay
- testability
- scenario authoring
- future replay playback
- architecture boundaries

## Decision

Player input will be represented as typed commands.

Keyboard input, scripted input, and future replay input all produce the same `PlayerCommand` contract.

Commands include:

- kind
- tick
- source

## Consequences

### Positive

This enables:

- deterministic scripted demos
- input replay
- clean runtime boundaries
- future scenario runner
- future replay engine
- easier tests

### Negative

Realtime input requires buffering into future ticks.

### Mitigation

The input system maps keys to commands and buffers them using tick-addressed command records.

## Final Principle

Input expresses intent.

The simulation decides effects.