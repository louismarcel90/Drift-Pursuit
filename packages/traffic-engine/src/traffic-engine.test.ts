import { describe, expect, it } from "vitest";

import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import { createGridPosition } from "@drift-pursuit-grid/domain";

import { highTrafficConfig } from "./traffic-config.js";
import { updateTrafficEngine } from "./traffic-engine.js";
import type { TrafficVehicle } from "@drift-pursuit-grid/domain";

describe("Traffic engine", () => {
  it("produces deterministic traffic for the same seed", () => {
    let firstRng = createDeterministicRng(2026);
    let secondRng = createDeterministicRng(2026);

    let firstTraffic: readonly TrafficVehicle[] = [];
    let secondTraffic: readonly TrafficVehicle[] = [];

    const playerPosition = createGridPosition(12, 8);

    for (let tick = 1; tick <= 8; tick += 1) {
      const firstResult = updateTrafficEngine({
        tick,
        playerPosition,
        trafficVehicles: firstTraffic,
        rng: firstRng,
        config: highTrafficConfig,
      });

      const secondResult = updateTrafficEngine({
        tick,
        playerPosition,
        trafficVehicles: secondTraffic,
        rng: secondRng,
        config: highTrafficConfig,
      });

      firstTraffic = [...firstResult.trafficVehicles];
      secondTraffic = [...secondResult.trafficVehicles];
      firstRng = firstResult.rng;
      secondRng = secondResult.rng;
    }

    expect(firstTraffic).toEqual(secondTraffic);
    expect(firstRng.state).toEqual(secondRng.state);
  });

  it("does not exceed configured max traffic vehicles", () => {
    let rng = createDeterministicRng(99);
    let trafficVehicles: readonly TrafficVehicle[] = [];

    const playerPosition = createGridPosition(0, 0);

    for (let tick = 1; tick <= 30; tick += 1) {
      const result = updateTrafficEngine({
        tick,
        playerPosition,
        trafficVehicles,
        rng,
        config: {
          ...highTrafficConfig,
          maxTrafficVehicles: 3,
          despawnDistanceFromPlayer: 999,
        },
      });

      trafficVehicles = [...result.trafficVehicles];
      rng = result.rng;
    }

    expect(trafficVehicles.length).toBeLessThanOrEqual(3);
  });
});