# Collision Engine Model

## Purpose

The collision engine gives physical and tactical meaning to mistakes.

In DRIFT PURSUIT GRID, collisions must be:

- detectable
- classified
- penalized
- evented
- explainable
- deterministic

## Current Responsibilities

At STEP 10, the collision engine handles:

- player versus target collision checks
- player versus traffic collision checks
- nearest collision selection
- collision kind classification
- severity classification
- speed penalties
- control penalties
- collision event emission

## Collision Kinds

Current supported collision kinds include:

- none
- front-impact
- traffic-scrape

Other kinds are already represented in the contracts and can be expanded later.

## Severity Model

Collision severity is currently based on impact speed.

Supported severities:

- minor
- moderate
- severe
- critical

## Effects

A collision may reduce:

- player speed
- player control level
- velocity magnitude

A collision may force the vehicle into:

- recovering
- control-lost

## Determinism

Collision behavior is deterministic.

Given the same authoritative state and same collision configuration, the engine returns the same collision result.

## Non-Goals

This step does not yet implement:

- continuous collision detection
- rotated bounding boxes
- advanced impulse physics
- multi-actor pileups
- road barrier collisions

Those can be added later without changing the core architecture.

## Reviewer Signal

This module shows that mistakes are not visual noise.

They become structured simulation events with cause, severity, and effect.
