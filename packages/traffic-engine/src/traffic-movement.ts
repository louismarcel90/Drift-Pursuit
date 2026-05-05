import type { GridPosition, TrafficVehicle } from "@drift-pursuit-grid/domain";

import type { TrafficEngineConfig } from "./traffic-config.js";

function calculateManhattanDistance(first: GridPosition, second: GridPosition): number {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function moveTrafficVehicle(vehicle: TrafficVehicle): TrafficVehicle {
  const nextX = Number((vehicle.position.x + vehicle.dynamics.velocity.x * 0.2).toFixed(4));
  const nextY = Number((vehicle.position.y + vehicle.dynamics.velocity.y * 0.2).toFixed(4));

  return {
    ...vehicle,
    position: {
      x: nextX,
      y: nextY,
    },
  };
}

export function updateTrafficMovement(params: {
  readonly playerPosition: GridPosition;
  readonly trafficVehicles: readonly TrafficVehicle[];
  readonly config: TrafficEngineConfig;
}): readonly TrafficVehicle[] {
  const { playerPosition, trafficVehicles, config } = params;

  return trafficVehicles
    .map((vehicle) => moveTrafficVehicle(vehicle))
    .filter(
      (vehicle) =>
        calculateManhattanDistance(playerPosition, vehicle.position) <=
        config.despawnDistanceFromPlayer,
    );
}
