# C4 Component — Simulation Runtime (Deep View)

## Purpose

This document describes the internal execution model of the DRIFT PURSUIT GRID simulation runtime.

It focuses on:

- deterministic execution
- component responsibilities
- state transitions
- event emission
- system guarantees

---

## 1. Core Principle

The simulation is:

```text
tick-based
deterministic
state-driven
event-emitting
```

## 2. Runtime Execution Graph

```bash
┌────────────────────────────┐
│     Input System           │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Command Intake             │
│ (validated commands)       │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Vehicle Dynamics           │
│ (player physics)           │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Target AI                  │
│ (evasion behavior)         │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Traffic Engine             │
│ (environment simulation)   │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Incident Engine            │
│ (dynamic hazards)          │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Degraded Mode Engine       │
│ (fault injection)          │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Collision Engine           │
│ (physical interaction)     │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Pursuit Engine             │
│ (mission evaluation)       │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ State Reducer              │
│ (authoritative state)      │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Event Emission             │
│ (immutable log)            │
└────────────┬───────────────┘
             ▼
┌────────────────────────────┐
│ Snapshot Projection        │
│ (render model)             │
└────────────────────────────┘

```

## 3. Deterministic Execution Order

```text
1. read commands
2. update player vehicle
3. update target AI
4. update traffic
5. update incidents
6. update degraded modes
7. resolve collisions
8. evaluate pursuit state
9. reduce authoritative state
10. emit events
11. project render state
```
