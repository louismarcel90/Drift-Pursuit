import { describe, expect, it } from "vitest";

import {
  createGridPosition,
  createInitialPursuitState,
  createStoppedPlayerVehicle,
  createTargetVehicle,
} from "@drift-pursuit-grid/domain";

import { updatePursuitState } from "./pursuit-engine.js";

describe("Pursuit engine", () => {
  it("acquires pursuit lock when target is close enough", () => {
    const player = createStoppedPlayerVehicle("player", createGridPosition(0, 0));
    const target = createTargetVehicle("target", createGridPosition(10, 0));

    const result = updatePursuitState({
      playerVehicle: player,
      targetVehicle: target,
      previousPursuitState: createInitialPursuitState(),
    });

    expect(result.pursuitState.lockState).toBe("acquired");
    expect(result.pursuitState.targetDistance).toBe(10);
  });

  it("loses pursuit lock with reason code when target is too far", () => {
    const player = createStoppedPlayerVehicle("player", createGridPosition(0, 0));
    const target = createTargetVehicle("target", createGridPosition(50, 0));

    const result = updatePursuitState({
      playerVehicle: player,
      targetVehicle: target,
      previousPursuitState: createInitialPursuitState(),
    });

    expect(result.pursuitState.lockState).toBe("lost");
    expect(result.reasonCode).toBe("target-distance-exceeded");
    expect(result.pursuitState.lastReasonCode).toBe("target-distance-exceeded");
  });

  it("opens intercept window when distance and pressure are sufficient", () => {
    const player = createStoppedPlayerVehicle("player", createGridPosition(0, 0));
    const target = createTargetVehicle("target", createGridPosition(3, 0));

    const result = updatePursuitState({
      playerVehicle: player,
      targetVehicle: target,
      previousPursuitState: {
        lockState: "acquired",
        targetDistance: 3,
        pursuitPressure: 0.7,
        interceptWindowOpen: false,
      },
    });

    expect(result.pursuitState.interceptWindowOpen).toBe(true);
    expect(result.reasonCode).toBe("mission-objective-completed");
  });
});
