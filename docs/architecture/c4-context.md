# C4 Context — DRIFT PURSUIT GRID

## System

DRIFT PURSUIT GRID is a terminal-native deterministic urban pursuit, evasion, and tactical mobility simulation platform.

## Primary User

The player interacts with the terminal client to run pursuit scenarios, control the vehicle, review replays, inspect debriefs, and verify evidence packs.

## External Dependencies

At the current stage, the system has no required external runtime services.

## Context Diagram

```text
┌──────────────────────────┐
│         Player           │
└────────────┬─────────────┘
             │ keyboard / terminal
             ▼
┌──────────────────────────┐
│  DRIFT PURSUIT GRID      │
│                          │
│ deterministic simulation │
│ replay verification      │
│ debrief explanation      │
│ evidence generation      │
└──────────────────────────┘
```
