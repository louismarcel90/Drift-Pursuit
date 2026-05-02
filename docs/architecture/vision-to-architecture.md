# Vision To Architecture

## Architectural Thesis

DRIFT PURSUIT GRID is built around a simple thesis:

The player sees a fast terminal pursuit experience, but the system underneath behaves like a deterministic simulation platform.

## Core Architectural Separation

The system separates:

- player input
- simulation commands
- authoritative state
- simulation events
- render state
- terminal rendering
- replay records
- evidence outputs

## Why This Matters

This separation prevents the project from becoming a tangled terminal game where rendering, input, physics, and mission logic are mixed together.

A clean architecture makes the project:

- easier to test
- easier to replay
- easier to explain
- easier to extend
- easier to review
- easier to trust

## High-Level Runtime Flow

1. Input system captures player intent.
2. Commands are normalized into typed contracts.
3. Simulation core advances one deterministic tick.
4. Engines update the authoritative state.
5. Events are emitted.
6. Rule engine derives explanations.
7. Render state is projected.
8. ASCII renderer draws the frame.
9. Replay engine records deterministic inputs and checkpoints.
10. Evidence engine exports mission proof data.

## Authoritative State Rule

The renderer is never the source of truth.

The authoritative simulation state is the only trusted source of truth.

## Package Boundary Philosophy

Each package must have one clear responsibility.

No package should become a hidden dumping ground for unrelated logic.

## Strategic Package Families

### Product Experience

- input-system
- renderer-ascii
- scenario-kit

### Simulation

- simulation-core
- vehicle-dynamics
- pursuit-engine
- traffic-engine
- incident-engine
- collision-engine
- ai-behaviors

### Assurance

- rule-engine
- replay-engine
- evidence-engine
- observability
- state-store

### Shared Foundation

- contracts
- domain
- deterministic-rng
- shared-config
- test-utils