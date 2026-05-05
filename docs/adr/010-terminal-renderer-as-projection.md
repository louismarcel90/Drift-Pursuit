# ADR 010 — Terminal Renderer As Projection

## Status

Accepted

## Context

Terminal games often mix rendering, input handling, movement, collision, and mission logic in one loop.

That approach is fast initially but becomes fragile when the project needs:

- deterministic replay
- authoritative state
- testing
- debrief generation
- evidence export
- future UI replacement

DRIFT PURSUIT GRID requires a clean boundary between simulation and presentation.

## Decision

The terminal renderer will be implemented as a projection layer.

It consumes authoritative simulation state and produces an ASCII frame.

It does not own state.

It does not mutate state.

It does not consume RNG.

It does not process commands.

## Consequences

### Positive

This enables:

- clean architecture
- testable rendering
- future replay views
- future debrief screens
- future renderer replacement
- deterministic simulation independence

### Negative

Rendering requires an explicit projection model.

This adds a small amount of structure compared to directly printing simulation objects.

### Mitigation

The render model stays simple:

- glyphs
- HUD lines
- event feed
- frame string

## Final Principle

The renderer displays the world.

It does not define the world.
