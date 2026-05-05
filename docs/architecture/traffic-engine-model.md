# Traffic Engine Model

## Purpose

The traffic engine makes the world feel alive without breaking determinism.

Traffic must look dynamic, but it must remain reproducible.

## Core Responsibilities

The traffic engine handles:

- deterministic vehicle spawning
- traffic density configuration
- civilian vehicle movement
- simple lane assignment
- despawn rules
- traffic update summaries

## Determinism Rule

Traffic behavior must depend only on:

- current tick
- current authoritative state
- deterministic RNG state
- traffic configuration

It must not depend on:

- Math.random()
- wall-clock time
- rendering speed
- terminal frame rate

## Current Model

At STEP 8, traffic vehicles:

- spawn ahead of the player
- receive a deterministic lane
- receive deterministic desired speed
- move toward the player direction
- despawn when too far from the player
- respect max traffic count

## Non-Goals

The current traffic engine does not yet implement:

- realistic lane changes
- congestion waves
- driver personality
- collision avoidance
- intersection logic

Those will be added later when the road model becomes stronger.

## Reviewer Signal

This module demonstrates that the project treats "living world" behavior as a deterministic system, not as random visual noise.
