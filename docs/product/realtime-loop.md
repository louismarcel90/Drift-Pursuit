# Realtime Loop Architecture

## Purpose

This document describes how realtime gameplay integrates with the deterministic simulation runtime.

---

## Core Loop

```text
input → commands → simulation tick → state → render → delay → repeat
```

## Execution Flow

```text
keyboard input
   ↓
input state buffer
   ↓
command mapping
   ↓
simulation tick
   ↓
authoritative state update
   ↓
render projection
   ↓
terminal output
   ↓
wait (100ms)
   ↓
next tick
```

## Separation of Concerns

```text
Input → intent
Simulation → truth
Renderer → display
```
