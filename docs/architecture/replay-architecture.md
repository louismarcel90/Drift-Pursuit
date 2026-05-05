# Replay Architecture

## Purpose

The replay engine verifies that DRIFT PURSUIT GRID can reproduce a simulation run from recorded inputs.

Replay is central to:

- debugging
- debrief
- evidence generation
- deterministic verification
- scenario comparison

## Replay Contract

The replay contract is:

```text
same scenario + same seed + same input log = same final checksum