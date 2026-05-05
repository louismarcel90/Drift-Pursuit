# Vehicle Dynamics Model

## Purpose

The vehicle dynamics model protects the game feel of DRIFT PURSUIT GRID.

The goal is not full real-world car physics.

The goal is simplified, deterministic, expressive vehicle behavior.

## Core Principles

The vehicle should feel:

- responsive
- readable
- weighted
- drift-capable
- recoverable
- deterministic

## Inputs

The model consumes normalized vehicle control intent:

- accelerate
- brake
- steer left
- steer right
- handbrake

## Outputs

The model produces an updated player vehicle state:

- speed
- heading
- velocity
- position
- drift factor
- control level
- control state

## Control States

The supported control states are:

- stable
- drifting
- recovering
- control-lost

## Drift Model

Drift increases when:

- handbrake is active
- steering is active
- speed is above the drift threshold

Drift decreases when handbrake pressure is removed.

## Determinism

The vehicle dynamics model is deterministic.

Given the same vehicle state and same control intent, it produces the same next vehicle state.

## Non-Goal

This model does not attempt to simulate full tire physics, suspension, traction circles, or real vehicle aerodynamics.

The model prioritizes gameplay clarity and deterministic behavior.
