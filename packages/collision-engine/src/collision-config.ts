export type CollisionEngineConfig = {
  readonly contactDistance: number;
  readonly minorSpeedThreshold: number;
  readonly moderateSpeedThreshold: number;
  readonly severeSpeedThreshold: number;
};

export const defaultCollisionEngineConfig: CollisionEngineConfig = {
  contactDistance: 1.4,
  minorSpeedThreshold: 3,
  moderateSpeedThreshold: 6,
  severeSpeedThreshold: 9,
};
