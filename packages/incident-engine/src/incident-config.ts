export type IncidentEngineConfig = {
  readonly spawnChancePerTick: number;
  readonly maxActiveIncidents: number;
  readonly minForwardOffset: number;
  readonly maxForwardOffset: number;
  readonly minDurationTicks: number;
  readonly maxDurationTicks: number;
};

export const defaultIncidentEngineConfig: IncidentEngineConfig = {
  spawnChancePerTick: 0.12,
  maxActiveIncidents: 3,
  minForwardOffset: 10,
  maxForwardOffset: 28,
  minDurationTicks: 6,
  maxDurationTicks: 14,
};
