# Degraded Modes And Fault Injection

## Purpose

The degraded mode engine introduces controlled system degradation into DRIFT PURSUIT GRID.

This supports:

- assurance thinking
- failure modeling
- replayable fault scenarios
- richer missions
- future evidence generation

## Current Responsibilities

At STEP 17, the degraded mode engine handles:

- deterministic fault injection
- degraded mode activation
- degraded mode recovery
- active degraded mode tracking
- fault code mapping
- event emission

## Supported Degraded Modes

Current degraded modes include:

- partial-hud
- intermittent-target-indicator
- delayed-event-feed
- reduced-visibility
- input-drop
- traffic-inconsistency

## Supported Fault Codes

Current fault codes include:

- hud-partial-failure
- target-indicator-intermittent
- event-feed-delayed
- input-drop-simulated
- visibility-reduced
- traffic-inconsistency-injected

## Determinism

Fault injection depends only on:

- current tick
- active degraded modes
- deterministic RNG state
- degraded mode config

It must not depend on:

- wall-clock time
- terminal rendering
- Math.random()
- hidden mutable state

## Boundary Rule

The degraded mode engine does not directly mutate the renderer, input system, traffic engine, or vehicle dynamics.

It updates authoritative degraded-mode state.

Other systems may later consume degraded-mode state explicitly.

## Non-Goals

This step does not yet implement full behavioral impact for every degraded mode.

Future steps may connect degraded modes to:

- HUD masking
- delayed event feed
- input drop behavior
- visibility constraints
- traffic inconsistency scenarios
- scoring penalties
- evidence packs

## Reviewer Signal

This module shows that failure is treated as a controlled simulation dimension, not an accident.