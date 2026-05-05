import { describe, expect, it } from "vitest";

import type { DegradedMode } from "@drift-pursuit-grid/contracts";
import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";

import { updateDegradedModeEngine } from "./degraded-mode-engine.js";

describe("Degraded mode engine", () => {
  it("activates a degraded mode deterministically when configured to always trigger", () => {
    const rng = createDeterministicRng(2026);

    const result = updateDegradedModeEngine({
      tick: 1,
      degradedModes: [],
      rng,
      config: {
        enabled: true,
        maxActiveDegradedModes: 2,
        rules: [
          {
            faultCode: "hud-partial-failure",
            degradedModeKind: "partial-hud",
            activationChancePerTick: 1,
            minDurationTicks: 5,
            maxDurationTicks: 5,
          },
        ],
      },
    });

    expect(result.activatedMode?.kind).toBe("partial-hud");
    expect(result.activatedMode?.faultCode).toBe("hud-partial-failure");
    expect(result.degradedModes).toHaveLength(1);
  });

  it("recovers expired degraded modes", () => {
    const rng = createDeterministicRng(1);

    const activeMode: DegradedMode = {
      kind: "partial-hud",
      status: "active",
      activatedAtTick: 1,
      recoveredAtTick: 3,
      faultCode: "hud-partial-failure",
    };

    const result = updateDegradedModeEngine({
      tick: 3,
      degradedModes: [activeMode],
      rng,
      config: {
        enabled: false,
        maxActiveDegradedModes: 2,
        rules: [],
      },
    });

    expect(result.degradedModes).toHaveLength(0);
    expect(result.recoveredModes).toHaveLength(1);
    expect(result.recoveredModes[0]?.status).toBe("recovered");
  });

  it("does not exceed max active degraded modes", () => {
    const rng = createDeterministicRng(99);

    const existingMode: DegradedMode = {
      kind: "partial-hud",
      status: "active",
      activatedAtTick: 1,
      recoveredAtTick: 10,
      faultCode: "hud-partial-failure",
    };

    const result = updateDegradedModeEngine({
      tick: 2,
      degradedModes: [existingMode],
      rng,
      config: {
        enabled: true,
        maxActiveDegradedModes: 1,
        rules: [
          {
            faultCode: "visibility-reduced",
            degradedModeKind: "reduced-visibility",
            activationChancePerTick: 1,
            minDurationTicks: 5,
            maxDurationTicks: 5,
          },
        ],
      },
    });

    expect(result.degradedModes).toHaveLength(1);
    expect(result.activatedMode).toBeUndefined();
  });
});
