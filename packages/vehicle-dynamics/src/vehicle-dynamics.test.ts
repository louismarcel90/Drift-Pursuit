import { describe, expect, it } from "vitest";

import { createGridPosition, createStoppedPlayerVehicle } from "@drift-pursuit-grid/domain";

import { deriveVehicleControlIntent } from "./vehicle-dynamics-command.js";
import { updatePlayerVehicleDynamics } from "./vehicle-dynamics-update.js";

describe("Vehicle dynamics", () => {
  it("accelerates the player vehicle", () => {
    const vehicle = createStoppedPlayerVehicle(
      "player-vehicle",
      createGridPosition(0, 0),
    );

    const intent = deriveVehicleControlIntent([
      {
        kind: "accelerate",
        tick: 1,
        source: "keyboard",
      },
    ]);

    const nextVehicle = updatePlayerVehicleDynamics(vehicle, intent);

    expect(nextVehicle.dynamics.speed).toBeGreaterThan(
      vehicle.dynamics.speed,
    );
    expect(nextVehicle.dynamics.controlState).toBe("stable");
  });

  it("brakes without allowing negative speed", () => {
    const vehicle = createStoppedPlayerVehicle(
      "player-vehicle",
      createGridPosition(0, 0),
    );

    const intent = deriveVehicleControlIntent([
      {
        kind: "brake",
        tick: 1,
        source: "keyboard",
      },
    ]);

    const nextVehicle = updatePlayerVehicleDynamics(vehicle, intent);

    expect(nextVehicle.dynamics.speed).toBe(0);
  });

  it("increases drift when handbrake and steering are applied at speed", () => {
    const vehicle = createStoppedPlayerVehicle(
      "player-vehicle",
      createGridPosition(0, 0),
    );

    const acceleratedVehicle = updatePlayerVehicleDynamics(
      vehicle,
      deriveVehicleControlIntent([
        {
          kind: "accelerate",
          tick: 1,
          source: "keyboard",
        },
      ]),
    );

    const fasterVehicle = updatePlayerVehicleDynamics(
      acceleratedVehicle,
      deriveVehicleControlIntent([
        {
          kind: "accelerate",
          tick: 2,
          source: "keyboard",
        },
      ]),
    );

    const driftingVehicle = updatePlayerVehicleDynamics(
      fasterVehicle,
      deriveVehicleControlIntent([
        {
          kind: "steer-right",
          tick: 3,
          source: "keyboard",
        },
        {
          kind: "handbrake",
          tick: 3,
          source: "keyboard",
        },
      ]),
    );

    expect(driftingVehicle.dynamics.driftFactor).toBeGreaterThan(0);
    expect(driftingVehicle.dynamics.controlState).toBe("drifting");
  });

  it("recovers drift when handbrake is released", () => {
    const vehicle = createStoppedPlayerVehicle(
      "player-vehicle",
      createGridPosition(0, 0),
    );

    let currentVehicle = vehicle;

    for (let tick = 1; tick <= 5; tick += 1) {
      currentVehicle = updatePlayerVehicleDynamics(
        currentVehicle,
        deriveVehicleControlIntent([
          {
            kind: "accelerate",
            tick,
            source: "keyboard",
          },
          {
            kind: "steer-right",
            tick,
            source: "keyboard",
          },
          {
            kind: "handbrake",
            tick,
            source: "keyboard",
          },
        ]),
      );
    }

    const driftingFactor = currentVehicle.dynamics.driftFactor;

    const recoveredVehicle = updatePlayerVehicleDynamics(
      currentVehicle,
      deriveVehicleControlIntent([]),
    );

    expect(recoveredVehicle.dynamics.driftFactor).toBeLessThan(
      driftingFactor,
    );
  });
});