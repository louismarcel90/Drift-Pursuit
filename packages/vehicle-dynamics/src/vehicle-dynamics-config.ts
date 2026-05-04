export type VehicleDynamicsConfig = {
  readonly accelerationPerTick: number;
  readonly brakingPerTick: number;
  readonly passiveDragPerTick: number;
  readonly maxSpeed: number;
  readonly normalTurnDegreesPerTick: number;
  readonly driftTurnDegreesPerTick: number;
  readonly driftIncreasePerTick: number;
  readonly driftRecoveryPerTick: number;
  readonly controlLossDriftThreshold: number;
  readonly controlRecoveryPerTick: number;
  readonly minimumControlLevel: number;
};

export const defaultVehicleDynamicsConfig: VehicleDynamicsConfig = {
  accelerationPerTick: 1.2,
  brakingPerTick: 1.8,
  passiveDragPerTick: 0.25,
  maxSpeed: 12,
  normalTurnDegreesPerTick: 12,
  driftTurnDegreesPerTick: 20,
  driftIncreasePerTick: 0.22,
  driftRecoveryPerTick: 0.12,
  controlLossDriftThreshold: 0.9,
  controlRecoveryPerTick: 0.08,
  minimumControlLevel: 0.25,
};