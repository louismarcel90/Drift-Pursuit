export type PursuitEngineConfig = {
  readonly lockAcquireDistance: number;
  readonly lockLossDistance: number;
  readonly interceptDistance: number;
  readonly interceptPressureMin: number;
  readonly pressureGainPerTick: number;
  readonly pressureLossPerTick: number;
  readonly maxPressure: number;
};

export const defaultPursuitEngineConfig: PursuitEngineConfig = {
  lockAcquireDistance: 18,
  lockLossDistance: 32,
  interceptDistance: 4,
  interceptPressureMin: 0.65,
  pressureGainPerTick: 0.08,
  pressureLossPerTick: 0.12,
  maxPressure: 1,
};