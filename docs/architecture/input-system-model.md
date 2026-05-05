# Input System Model

## Purpose

The input system converts player intent into typed simulation commands.

It does not mutate simulation state directly.

## Current Responsibilities

At STEP 14, the input system supports:

- keyboard mapping
- command buffering
- scripted input
- realtime terminal input demo
- typed player commands

## Boundary Rule

The input system may produce commands.

It must not:

- update vehicle state
- update mission state
- mutate authoritative state
- emit simulation events directly
- consume simulation RNG

## Input Sources

Supported input sources:

- keyboard
- scenario-script
- replay

## Why Scripted Input Matters

Scripted input supports:

- demos
- tests
- deterministic walkthroughs
- replay preparation
- showcase scenarios

## Why Realtime Input Matters

Realtime input preserves the fun and tactile feel of the project.

The simulation still remains tick-based and deterministic because keyboard actions are converted into tick-addressed commands.

## Reviewer Signal

This module proves that user interaction is treated as a clean command boundary, not mixed into the simulation loop.