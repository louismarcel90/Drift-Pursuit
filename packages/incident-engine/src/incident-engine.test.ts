import { describe, expect, it } from "vitest";

import { createDeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import { createGridPosition } from "@drift-pursuit-grid/domain";
import type { Incident } from "@drift-pursuit-grid/domain";

import { updateIncidentEngine } from "./incident-engine.js";

describe("Incident engine", () => {
  it("produces deterministic incidents for the same seed", () => {
    let firstRng = createDeterministicRng(2026);
    let secondRng = createDeterministicRng(2026);

    let firstIncidents: readonly Incident[] = [];
    let secondIncidents: readonly Incident[] = [];

    const playerPosition = createGridPosition(10, 5);

    for (let tick = 1; tick <= 20; tick += 1) {
      const firstResult = updateIncidentEngine({
        tick,
        playerPosition,
        incidents: firstIncidents,
        rng: firstRng,
      });

      const secondResult = updateIncidentEngine({
        tick,
        playerPosition,
        incidents: secondIncidents,
        rng: secondRng,
      });

      firstIncidents = firstResult.incidents;
      secondIncidents = secondResult.incidents;
      firstRng = firstResult.rng;
      secondRng = secondResult.rng;
    }

    expect(firstIncidents).toEqual(secondIncidents);
    expect(firstRng.state).toEqual(secondRng.state);
  });

  it("respects the max active incidents limit", () => {
    let rng = createDeterministicRng(99);
    let incidents: readonly Incident[] = [];

    for (let tick = 1; tick <= 30; tick += 1) {
      const result = updateIncidentEngine({
        tick,
        playerPosition: createGridPosition(0, 0),
        incidents,
        rng,
        config: {
          spawnChancePerTick: 1,
          maxActiveIncidents: 2,
          minForwardOffset: 5,
          maxForwardOffset: 6,
          minDurationTicks: 100,
          maxDurationTicks: 100,
        },
      });

      incidents = result.incidents;
      rng = result.rng;
    }

    expect(incidents.length).toBeLessThanOrEqual(2);
  });

  it("removes resolved incidents after their end tick", () => {
    let rng = createDeterministicRng(1);
    let incidents: readonly Incident[] = [];

    const created = updateIncidentEngine({
      tick: 1,
      playerPosition: createGridPosition(0, 0),
      incidents,
      rng,
      config: {
        spawnChancePerTick: 1,
        maxActiveIncidents: 3,
        minForwardOffset: 5,
        maxForwardOffset: 5,
        minDurationTicks: 1,
        maxDurationTicks: 1,
      },
    });

    incidents = created.incidents;
    rng = created.rng;

    const resolved = updateIncidentEngine({
      tick: 2,
      playerPosition: createGridPosition(0, 0),
      incidents,
      rng,
      config: {
        spawnChancePerTick: 0,
        maxActiveIncidents: 3,
        minForwardOffset: 5,
        maxForwardOffset: 5,
        minDurationTicks: 1,
        maxDurationTicks: 1,
      },
    });

    expect(resolved.incidents).toHaveLength(0);
  });
});
