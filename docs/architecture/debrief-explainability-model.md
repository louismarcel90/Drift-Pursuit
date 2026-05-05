# Debrief And Explainability Model

## Purpose

The debrief engine turns a simulation run into an understandable diagnostic report.

The player should understand:

- what happened
- why it happened
- what mattered most
- what should be improved

## Current Responsibilities

At STEP 16, the debrief engine handles:

- key event extraction
- collision count
- incident count
- pursuit loss explanation
- intercept explanation
- primary reason code
- readable debrief rendering

## Explainability Rule

Major outcomes must map to reason codes.

Examples:

- target-distance-exceeded
- collision-control-loss
- mission-objective-completed
- mission-timeout

## Boundary Rule

The debrief engine consumes authoritative state.

It must not mutate simulation state.

## Non-Goals

This step does not yet implement:

- scoring integration
- timeline charts
- replay step inspection
- evidence export
- advanced coaching recommendations

Those will be added later.

## Reviewer Signal

This module demonstrates that simulation outcomes are not opaque.

They are explainable, reason-coded, and ready for replay/evidence workflows.
