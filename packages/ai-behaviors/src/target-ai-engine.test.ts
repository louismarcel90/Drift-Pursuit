import { describe, expect, it } from "vitest";

import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import { createGridPosition, createTargetVehicle } from "@drift-pursuit-grid/domain";

import { updateTargetAi } from "./target-ai-engine.js";

describe("Target AI engine", () => {
  it("produces deterministic target behavior for the same seed", () => {
    let firstRng = createDeterministicRng(2026);
    let secondRng = createDeterministicRng(2026);

    let firstTarget = createTargetVehicle("target", createGridPosition(10, 0));
    let secondTarget = createTargetVehicle("target", createGridPosition(10, 0));

    for (let tick = 1; tick <= 6; tick += 1) {
      const firstResult = updateTargetAi({
        targetVehicle: firstTarget,
        pursuitState: {
          lockState: "acquired",
          targetDistance: 8,
          pursuitPressure: 0.4,
          interceptWindowOpen: false
        },
        trafficVehicles: [],
        rng: firstRng
      });

      const secondResult = updateTargetAi({
        targetVehicle: secondTarget,
        pursuitState: {
          lockState: "acquired",
          targetDistance: 8,
          pursuitPressure: 0.4,
          interceptWindowOpen: false
        },
        trafficVehicles: [],
        rng: secondRng
      });

      firstTarget = firstResult.targetVehicle;
      secondTarget = secondResult.targetVehicle;
      firstRng = firstResult.rng;
      secondRng = secondResult.rng;
    }

    expect(firstTarget).toEqual(secondTarget);
    expect(firstRng.state).toEqual(secondRng.state);
  });

  it("increases target speed under high pursuit pressure", () => {
    const rng = createDeterministicRng(99);
    const target = createTargetVehicle("target", createGridPosition(10, 0));

    const result = updateTargetAi({
      targetVehicle: target,
      pursuitState: {
        lockState: "acquired",
        targetDistance: 5,
        pursuitPressure: 0.9,
        interceptWindowOpen: false
      },
      trafficVehicles: [],
      rng
    });

    expect(result.targetVehicle.dynamics.speed).toBeGreaterThanOrEqual(
      target.dynamics.speed
    );
    expect(["increase-speed", "pressure-escape"]).toContain(result.decision.kind);
  });
});