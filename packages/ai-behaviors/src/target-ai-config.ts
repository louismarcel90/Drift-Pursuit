export type TargetAiConfig = {
  readonly baseSpeed: number;
  readonly maxSpeed: number;
  readonly pressureSpeedBoost: number;
  readonly lateralMoveChance: number;
  readonly maxLateralOffsetPerTick: number;
  readonly headingChangeDegrees: number;
};

export const defaultTargetAiConfig: TargetAiConfig = {
  baseSpeed: 3,
  maxSpeed: 7,
  pressureSpeedBoost: 2,
  lateralMoveChance: 0.35,
  maxLateralOffsetPerTick: 1,
  headingChangeDegrees: 10
};