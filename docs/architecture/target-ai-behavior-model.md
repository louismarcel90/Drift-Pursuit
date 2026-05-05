# Target AI Behavior Model

## Purpose

The target AI gives the pursuit a tactical opponent.

The target must feel alive without becoming magical or unfair.

## Current Responsibilities

At STEP 11, the target AI handles:

- deterministic target movement
- pressure-sensitive speed changes
- simple lateral shifts
- nearby traffic awareness
- decision reason messages

## Determinism

Target behavior depends only on:

- target vehicle state
- pursuit state
- traffic vehicles
- deterministic RNG state
- AI config
- AI profile

It must not depend on:

- wall-clock time
- rendering
- Math.random()
- hidden mutable state

## Decision Types

Current decision types:

- hold-line
- increase-speed
- shift-left
- shift-right
- pressure-escape

## Explainability

Every AI update produces a decision and reason.

This supports:

- event feed
- debrief
- replay review
- future evidence generation

## Non-Goals

This step does not yet implement:

- route planning
- road graph navigation
- advanced evasion tactics
- predictive interception avoidance
- personality learning

Those will be added later.

## Reviewer Signal

This module shows that adversarial behavior is deterministic, explainable, and testable.
