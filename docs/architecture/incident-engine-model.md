# Incident Engine Model

## Purpose

The incident engine injects dynamic urban events without breaking determinism.

Incidents create:

- tension
- route adaptation
- replay variety
- mission storytelling
- future debrief material

## Current Responsibilities

At STEP 12, the incident engine handles:

- deterministic incident spawning
- active incident lifecycle
- incident expiration
- incident severity
- incident positioning relative to player
- incident-created event emission

## Incident Kinds

Current incident kinds:

- stalled-vehicle
- lane-blockage
- minor-crash
- road-work
- reduced-visibility-zone
- surface-low-grip

## Determinism

Incident behavior depends only on:

- current tick
- player position
- active incidents
- deterministic RNG state
- incident configuration

It must not depend on:

- Math.random()
- wall-clock time
- rendering speed
- hidden mutable state

## Non-Goals

This step does not yet apply incident effects to:

- vehicle grip
- traffic routing
- visibility
- pursuit line-of-sight
- HUD degradation

Those impacts will be integrated later.

## Reviewer Signal

This module shows that dynamic events are not random chaos.

They are controlled, replayable simulation facts.
