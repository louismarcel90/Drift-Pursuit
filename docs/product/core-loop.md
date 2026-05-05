# Core Loop

## One-Sentence Core Loop

Catch, maintain, intercept, or evade under dynamic urban conditions while preserving control, reading risk, and adapting to traffic, incidents, and degraded systems.

## Player Loop

1. Read the road.
2. React to the target.
3. Manage speed.
4. Drift with control.
5. Avoid traffic and hazards.
6. Maintain pursuit pressure or escape pressure.
7. Recover from mistakes.
8. Finish the mission.
9. Review the debrief.
10. Replay and improve.

## Simulation Loop

Every simulation tick follows a fixed deterministic order:

1. Collect player commands.
2. Update player vehicle dynamics.
3. Update target AI behavior.
4. Update traffic behavior.
5. Update incidents and hazards.
6. Resolve collisions.
7. Evaluate pursuit state.
8. Evaluate mission state.
9. Emit simulation events.
10. Derive render state.
11. Render terminal frame.

## Non-Negotiable Rule

The simulation loop must remain deterministic.

Same scenario plus same seed plus same input sequence must produce the same outcome.

## Fun Requirements

The loop must preserve:

- immediate feedback
- readable movement
- constant tension
- understandable failure
- satisfying recovery
- replayable challenge

## Engineering Requirements

The loop must support:

- fixed tick execution
- stable phase ordering
- authoritative state transitions
- event emission
- replay verification
- debrief extraction
- evidence generation
