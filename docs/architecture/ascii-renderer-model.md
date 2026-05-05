# ASCII Renderer Model

## Purpose

The ASCII renderer is the visual projection layer of DRIFT PURSUIT GRID.

It turns authoritative simulation state into a readable terminal experience.

## Core Rule

The renderer is not authoritative.

It must never mutate simulation state.

## Current Responsibilities

At STEP 13, the renderer handles:

- render model projection
- road glyphs
- player glyph
- target glyph
- traffic glyphs
- incident glyphs
- HUD rendering
- event feed rendering
- terminal frame rendering

## Glyphs

Current glyph mapping:

- P = player
- T = target
- C = civilian traffic
- ! = incident
- = = main road lane
- - = side lane marker

## Boundaries

The renderer may:

- simplify coordinates
- clamp positions to visible grid
- format HUD values
- display event feed

The renderer must not:

- change vehicle position
- change mission status
- emit simulation events
- update pursuit state
- consume RNG
- process player commands

## Reviewer Signal

This module proves that terminal presentation is treated as a clean projection, not mixed with business logic or simulation rules.