# Scenario Kit Model

## Purpose

The scenario kit makes DRIFT PURSUIT GRID extensible.

It turns missions into structured, validated definitions instead of hard-coded runtime behavior.

## Current Responsibilities

At STEP 18, the scenario kit handles:

- scenario definitions
- built-in scenarios
- scenario validation
- scripted input conversion
- scenario loading

## Scenario Definition

A scenario includes:

- id
- title
- mode
- difficulty
- description
- seed
- total ticks
- tick duration
- traffic profile
- incident profile
- degraded profile
- scripted input

## Why This Matters

Scenarios provide:

- repeatable demos
- deterministic tests
- showcase runs
- future mission authoring
- future scenario packs
- replay-friendly execution

## Boundary Rule

The scenario kit defines configuration and scripted intent.

It does not:

- mutate authoritative state
- render frames
- resolve collisions
- run target AI
- update traffic
- generate evidence

## Reviewer Signal

This module shows that gameplay content is treated as a governed input to the simulation, not as scattered hard-coded logic.
