import type { SimulationSnapshot, VehicleSnapshot } from "@drift-pursuit-grid/contracts";
import type { Vehicle } from "@drift-pursuit-grid/domain";

import type { AuthoritativeSimulationState } from "../src/authoritative-state.js";

function projectVehicleSnapshot(vehicle: Vehicle): VehicleSnapshot {
  return {
    id: vehicle.identity.id,
    x: vehicle.position.x,
    y: vehicle.position.y,
    speed: vehicle.dynamics.speed,
    headingDegrees: vehicle.dynamics.headingDegrees,
    driftFactor: vehicle.dynamics.driftFactor,
    controlLevel: vehicle.dynamics.controlLevel,
  };
}

export function projectSimulationSnapshot(
  state: AuthoritativeSimulationState,
): SimulationSnapshot {
  return {
    scenarioId: state.scenarioId,
    seed: state.seed,
    tick: state.tick,
    mode: state.mode,
    missionStatus: state.missionStatus,
    healthStatus: state.degradedModes.length > 0 ? "degraded" : "nominal",
    playerVehicle: projectVehicleSnapshot(state.playerVehicle),
    degradedModes: [...state.degradedModes],
  };
}