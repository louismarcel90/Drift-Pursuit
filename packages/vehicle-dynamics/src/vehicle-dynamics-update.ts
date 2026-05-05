import type { PlayerVehicle } from "@drift-pursuit-grid/domain";

import type { VehicleControlIntent } from "./vehicle-dynamics-command.js";

export function updatePlayerVehicleDynamics(
  vehicle: PlayerVehicle,
  intent: VehicleControlIntent,
): PlayerVehicle {
  const nextSpeed = calculateNextSpeed(vehicle.dynamics.speed, intent);

  const nextDriftFactor = calculateNextDriftFactor(vehicle.dynamics.driftFactor, nextSpeed, intent);

  const nextControlState = nextDriftFactor > 0 ? "drifting" : "stable";

  return {
    ...vehicle,
    dynamics: {
      ...vehicle.dynamics,
      speed: nextSpeed,
      driftFactor: nextDriftFactor,
      controlState: nextControlState,
    },
  };
}

function calculateNextSpeed(currentSpeed: number, intent: VehicleControlIntent): number {
  if (intent.brake) {
    return Math.max(0, currentSpeed - 2);
  }

  if (intent.accelerate) {
    return currentSpeed + 3;
  }

  return currentSpeed;
}

function calculateNextDriftFactor(
  currentDriftFactor: number,
  speed: number,
  intent: VehicleControlIntent,
): number {
  if (intent.handbrake && speed > 0 && (intent.steerLeft || intent.steerRight)) {
    return Math.min(1, currentDriftFactor + 0.35);
  }

  if (!intent.handbrake) {
    return Math.max(0, currentDriftFactor - 0.2);
  }

  return currentDriftFactor;
}
