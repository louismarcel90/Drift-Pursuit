export type TrafficDensityLevel = "low" | "medium" | "high";

export type TrafficEngineConfig = {
  readonly density: TrafficDensityLevel;
  readonly maxTrafficVehicles: number;
  readonly spawnChancePerTick: number;
  readonly minDesiredSpeed: number;
  readonly maxDesiredSpeed: number;
  readonly despawnDistanceFromPlayer: number;
};

export const lowTrafficConfig: TrafficEngineConfig = {
  density: "low",
  maxTrafficVehicles: 4,
  spawnChancePerTick: 0.25,
  minDesiredSpeed: 1,
  maxDesiredSpeed: 3,
  despawnDistanceFromPlayer: 40,
};

export const mediumTrafficConfig: TrafficEngineConfig = {
  density: "medium",
  maxTrafficVehicles: 8,
  spawnChancePerTick: 0.45,
  minDesiredSpeed: 1,
  maxDesiredSpeed: 4,
  despawnDistanceFromPlayer: 45,
};

export const highTrafficConfig: TrafficEngineConfig = {
  density: "high",
  maxTrafficVehicles: 12,
  spawnChancePerTick: 0.7,
  minDesiredSpeed: 1,
  maxDesiredSpeed: 5,
  despawnDistanceFromPlayer: 50,
};

export const defaultTrafficEngineConfig: TrafficEngineConfig = mediumTrafficConfig;