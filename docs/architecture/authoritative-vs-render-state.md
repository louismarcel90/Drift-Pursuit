# Authoritative State vs Render State

## Purpose

DRIFT PURSUIT GRID separates authoritative simulation state from render state.

This is a non-negotiable architectural boundary.

## Authoritative State

The authoritative state is the source of truth.

It contains:

- scenario id
- seed
- current tick
- simulation mode
- mission status
- player vehicle
- target vehicle
- traffic vehicles
- incidents
- pursuit state
- mission progress
- degraded modes
- simulation events

## Render State

Render state is only a projection for terminal display.

It may simplify, crop, decorate, or format simulation data.

Render state must never become the source of truth.

## Why This Matters

This boundary enables:

- deterministic replay
- testable simulation logic
- stable event recording
- clear debrief generation
- evidence export
- renderer replacement
- better debugging

## Non-Negotiable Rule

The renderer cannot mutate authoritative state.

Only approved reducers can transition authoritative state.

## Current Implementation

The package responsible for authoritative state is:

```text
packages/state-store