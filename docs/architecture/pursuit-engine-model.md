# Pursuit Engine Model

## Purpose

The pursuit engine turns movement into tactical chase behavior.

It answers:

- is the target being tracked?
- is pursuit pressure increasing?
- is the target too far?
- is an interception possible?
- why was pursuit lost?

## Current Responsibilities

At STEP 9, the pursuit engine computes:

- target distance
- pursuit lock state
- pursuit pressure
- pursuit loss reason
- intercept window state

## Determinism

The pursuit engine is deterministic.

Given the same player vehicle, target vehicle, previous pursuit state, and config, it returns the same pursuit state.

## Reason-Coded Outcomes

Pursuit loss must include a reason code.

Example:

```text
target-distance-exceeded
```
