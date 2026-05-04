import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { GridPosition, TrafficVehicle } from "@drift-pursuit-grid/domain";

import type { TrafficEngineConfig } from "./traffic-config.js";

export type TrafficSpawnResult = {
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly rng: DeterministicRng;
  readonly spawned: boolean;
};

function createTrafficVehicleId(tick: number, sequence: number): string {
  return `traffic-${tick}-${sequence}`;
}

function createTrafficPosition(
  playerPosition: GridPosition,
  laneIndex: number,
  forwardOffset: number,
): GridPosition {
  return {
    x: playerPosition.x + forwardOffset,
    y: playerPosition.y + laneIndex - 1,
  };
}

export function maybeSpawnTrafficVehicle(params: {
  readonly tick: number;
  readonly playerPosition: GridPosition;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly config: TrafficEngineConfig;
  readonly rng: DeterministicRng;
}): TrafficSpawnResult {
  const { tick, playerPosition, trafficVehicles, config, rng } = params;

  if (trafficVehicles.length >= config.maxTrafficVehicles) {
    return {
      trafficVehicles,
      rng,
      spawned: false,
    };
  }

  const [shouldSpawn, rngAfterSpawnRoll] = rng.nextBoolean(config.spawnChancePerTick);

  if (!shouldSpawn) {
    return {
      trafficVehicles,
      rng: rngAfterSpawnRoll,
      spawned: false,
    };
  }

  const [laneIndex, rngAfterLane] = rngAfterSpawnRoll.nextInt(0, 2);
  const [forwardOffset, rngAfterOffset] = rngAfterLane.nextInt(12, 24);
  const [desiredSpeed, rngAfterSpeed] = rngAfterOffset.nextInt(
    config.minDesiredSpeed,
    config.maxDesiredSpeed,
  );

  const trafficVehicle: TrafficVehicle = {
    identity: {
      id: createTrafficVehicleId(tick, trafficVehicles.length + 1),
      role: "traffic",
      displayName: "C",
    },
    laneId: `lane-${laneIndex}`,
    desiredSpeed,
    position: createTrafficPosition(playerPosition, laneIndex, forwardOffset),
    dynamics: {
      speed: desiredSpeed,
      headingDegrees: 180,
      velocity: {
        x: -desiredSpeed,
        y: 0,
      },
      driftFactor: 0,
      controlLevel: 1,
      controlState: "stable",
    },
  };

  return {
    trafficVehicles: [...trafficVehicles, trafficVehicle],
    rng: rngAfterSpeed,
    spawned: true,
  };
}