import { describe, expect, it } from "vitest";

import {
  createGridPosition,
  createStoppedPlayerVehicle,
  createTargetVehicle,
} from "@drift-pursuit-grid/domain";
import type { PlayerVehicle, TrafficVehicle } from "@drift-pursuit-grid/domain";

import { updateCollisionEngine } from "./collision-engine.js";

function createMovingPlayerVehicle(speed: number): PlayerVehicle {
  const vehicle = createStoppedPlayerVehicle("player", createGridPosition(0, 0));

  return {
    ...vehicle,
    dynamics: {
      ...vehicle.dynamics,
      speed,
      velocity: {
        x: speed,
        y: 0,
      },
    },
  };
}

function createTrafficVehicleAtPlayer(): TrafficVehicle {
  return {
    identity: {
      id: "traffic-1",
      role: "traffic",
      displayName: "C",
    },
    laneId: "lane-1",
    desiredSpeed: 2,
    position: createGridPosition(0.5, 0),
    dynamics: {
      speed: 2,
      headingDegrees: 180,
      velocity: {
        x: -2,
        y: 0,
      },
      driftFactor: 0,
      controlLevel: 1,
      controlState: "stable",
    },
  };
}

describe("Collision engine", () => {
  it("detects no collision when actors are far away", () => {
    const playerVehicle = createMovingPlayerVehicle(5);
    const targetVehicle = createTargetVehicle("target", createGridPosition(20, 0));

    const result = updateCollisionEngine({
      playerVehicle,
      targetVehicle,
      trafficVehicles: [],
    });

    expect(result.collided).toBe(false);
    expect(result.collisionResult.kind).toBe("none");
  });

  it("detects collision with target when close enough", () => {
    const playerVehicle = createMovingPlayerVehicle(7);
    const targetVehicle = createTargetVehicle("target", createGridPosition(1, 0));

    const result = updateCollisionEngine({
      playerVehicle,
      targetVehicle,
      trafficVehicles: [],
    });

    expect(result.collided).toBe(true);
    expect(result.collidedActorId).toBe("target");
    expect(result.collisionResult.kind).toBe("front-impact");
  });

  it("detects collision with traffic and applies penalties", () => {
    const playerVehicle = createMovingPlayerVehicle(8);
    const trafficVehicle = createTrafficVehicleAtPlayer();

    const result = updateCollisionEngine({
      playerVehicle,
      trafficVehicles: [trafficVehicle],
    });

    expect(result.collided).toBe(true);
    expect(result.collidedActorId).toBe("traffic-1");
    expect(result.collisionResult.kind).toBe("traffic-scrape");
    expect(result.playerVehicle.dynamics.speed).toBeLessThan(playerVehicle.dynamics.speed);
    expect(result.playerVehicle.dynamics.controlLevel).toBeLessThan(
      playerVehicle.dynamics.controlLevel,
    );
  });
});
