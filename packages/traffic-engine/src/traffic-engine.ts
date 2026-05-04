import type { DeterministicRng } from "@drift-pursuit-grid/deterministic-rng";
import type { GridPosition, TrafficVehicle } from "@drift-pursuit-grid/domain";

import { defaultTrafficEngineConfig } from "./traffic-config.js";
import type { TrafficEngineConfig } from "./traffic-config.js";
import { updateTrafficMovement } from "./traffic-movement.js";
import { maybeSpawnTrafficVehicle } from "./traffic-spawn.js";

export type TrafficEngineInput = {
  readonly tick: number;
  readonly playerPosition: GridPosition;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly rng: DeterministicRng;
  readonly config?: TrafficEngineConfig;
};

export type TrafficEngineResult = {
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly rng: DeterministicRng;
  readonly spawnedVehicle: boolean;
};

export function updateTrafficEngine(input: TrafficEngineInput): TrafficEngineResult {
  const config = input.config ?? defaultTrafficEngineConfig;

  const movedTrafficVehicles = updateTrafficMovement({
    playerPosition: input.playerPosition,
    trafficVehicles: input.trafficVehicles,
    config,
  });

  const spawnResult = maybeSpawnTrafficVehicle({
    tick: input.tick,
    playerPosition: input.playerPosition,
    trafficVehicles: movedTrafficVehicles,
    config,
    rng: input.rng,
  });

  return {
    trafficVehicles: spawnResult.trafficVehicles,
    rng: spawnResult.rng,
    spawnedVehicle: spawnResult.spawned,
  };
}