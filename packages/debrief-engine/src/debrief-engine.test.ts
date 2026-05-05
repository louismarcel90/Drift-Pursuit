import { describe, expect, it } from "vitest";
import type { SimulationEvent } from "@drift-pursuit-grid/contracts";
import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle
} from "@drift-pursuit-grid/domain";
import {
  createAuthoritativeSimulationState,
  reduceAuthoritativeState
} from "@drift-pursuit-grid/state-store";

import { createDebriefSummary, renderDebriefSummary } from "./debrief-engine.js";
import { extractDebriefEvents } from "./event-extractor.js";

function createTestState() {
  return createAuthoritativeSimulationState({
    scenarioId: "test.debrief",
    seed: 2026,
    mode: "showcase",
    playerVehicle: createStoppedPlayerVehicle("player", createGridPosition(0, 0)),
    pursuitState: createInitialPursuitState(),
    missionProgress: {
      missionId: "test.debrief",
      status: "in-progress",
      completedObjectiveIds: []
    }
  });
}

describe("Debrief engine", () => {
  it("extracts key events from the event stream", () => {
    const events: readonly SimulationEvent[] = [
  {
    kind: "vehicle-updated",
    tick: 1,
    message: "Vehicle updated.",
  },
  {
    kind: "collision-detected",
    tick: 2,
    message: "Collision detected.",
    collisionKind: "traffic-scrape",
    severity: "minor",
  },
  {
    kind: "incident-created",
    tick: 3,
    message: "Incident created.",
    incidentId: "incident-test-001",
  },
] as const;

    const extracted = extractDebriefEvents(events);

    expect(extracted.keyEvents).toHaveLength(2);
    expect(extracted.collisionEvents).toHaveLength(1);
    expect(extracted.incidentEvents).toHaveLength(1);
  });

  it("creates an incomplete debrief when no decisive outcome exists", () => {
    const state = createTestState();

    const summary = createDebriefSummary(state);

    expect(summary.outcome).toBe("incomplete");
    expect(summary.primaryReasonCode).toBe("mission-timeout");
  });

  it("creates a collision-related debrief when collision events exist", () => {
    const state = createTestState();

    const stateWithCollision = reduceAuthoritativeState(state, {
      kind: "append-events",
      events: [
        {
          kind: "collision-detected",
          tick: 2,
          message: "Collision detected with traffic-1. Severity: minor.",
          collisionKind: "traffic-scrape",
          severity: "minor"
        }
      ]
    });

    const summary = createDebriefSummary(stateWithCollision);

    expect(summary.collisionCount).toBe(1);
    expect(summary.primaryReasonCode).toBe("collision-control-loss");
    expect(summary.highlights[0]?.kind).toBe("collision-cost");
  });

  it("renders a readable debrief summary", () => {
    const state = createTestState();
    const summary = createDebriefSummary(state);
    const rendered = renderDebriefSummary(summary);

    expect(rendered).toContain("DEBRIEF SUMMARY");
    expect(rendered).toContain("Scenario");
    expect(rendered).toContain("Reason Code");
  });
});