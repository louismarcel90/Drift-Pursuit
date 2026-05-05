import { describe, expect, it } from "vitest";

import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle,
} from "@drift-pursuit-grid/domain";

import { createAuthoritativeSimulationState } from "./authoritative-state.js";
import { reduceAuthoritativeState } from "./state-reducer.js";
import { validateAuthoritativeState } from "./state-guards.js";
import { projectSimulationSnapshot } from "./snapshot-projector.js";

function createTestState() {
  return createAuthoritativeSimulationState({
    scenarioId: "test.authoritative-state",
    seed: 2026,
    mode: "showcase",
    playerVehicle: createStoppedPlayerVehicle("player-vehicle", createGridPosition(12, 8)),
    pursuitState: createInitialPursuitState(),
    missionProgress: {
      missionId: "mission.test",
      status: "in-progress",
      completedObjectiveIds: [],
    },
  });
}

describe("AuthoritativeSimulationState", () => {
  it("creates a valid initial authoritative state", () => {
    const state = createTestState();

    const result = validateAuthoritativeState(state);

    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("advances state through a pure reducer", () => {
    const state = createTestState();

    const nextState = reduceAuthoritativeState(state, {
      kind: "advance-tick",
      tick: 1,
    });

    expect(state.tick).toBe(0);
    expect(nextState.tick).toBe(1);
  });

  it("projects authoritative state into a simulation snapshot", () => {
    const state = createTestState();

    const snapshot = projectSimulationSnapshot(state);

    expect(snapshot.scenarioId).toBe("test.authoritative-state");
    expect(snapshot.playerVehicle.id).toBe("player-vehicle");
    expect(snapshot.healthStatus).toBe("nominal");
  });

  it("rejects invalid player speed", () => {
    const state = createTestState();

    const invalidState = {
      ...state,
      playerVehicle: {
        ...state.playerVehicle,
        dynamics: {
          ...state.playerVehicle.dynamics,
          speed: -1,
        },
      },
    };

    const result = validateAuthoritativeState(invalidState);

    expect(result.valid).toBe(false);
    expect(result.violations[0]?.code).toBe("negative-player-speed");
  });
});
