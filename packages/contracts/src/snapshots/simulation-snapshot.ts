import type { DegradedMode } from "../degraded/index.js";
import type { MissionStatus, SimulationMode } from "../mission/index.js";

export type EngineHealthStatus = "nominal" | "degraded" | "failed";

export type VehicleSnapshot = {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly speed: number;
  readonly headingDegrees: number;
  readonly driftFactor: number;
  readonly controlLevel: number;
};

export type PursuitSnapshot = {
  readonly targetDistance: number;
  readonly pursuitPressure: number;
  readonly hasPursuitLock: boolean;
  readonly interceptWindowOpen: boolean;
};

export type SimulationSnapshot = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly tick: number;
  readonly mode: SimulationMode;
  readonly missionStatus: MissionStatus;
  readonly healthStatus: EngineHealthStatus;
  readonly playerVehicle: VehicleSnapshot;
  readonly targetVehicle?: VehicleSnapshot;
  readonly pursuit?: PursuitSnapshot;
  readonly degradedModes: readonly DegradedMode[];
};