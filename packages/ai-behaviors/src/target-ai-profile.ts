export type TargetAiProfileKind = "cautious" | "balanced" | "aggressive";

export type TargetAiProfile = {
  readonly kind: TargetAiProfileKind;
  readonly riskAppetite: number;
  readonly trafficTolerance: number;
  readonly pressureSensitivity: number;
};

export const cautiousTargetProfile: TargetAiProfile = {
  kind: "cautious",
  riskAppetite: 0.25,
  trafficTolerance: 0.35,
  pressureSensitivity: 0.8
};

export const balancedTargetProfile: TargetAiProfile = {
  kind: "balanced",
  riskAppetite: 0.55,
  trafficTolerance: 0.55,
  pressureSensitivity: 0.65
};

export const aggressiveTargetProfile: TargetAiProfile = {
  kind: "aggressive",
  riskAppetite: 0.85,
  trafficTolerance: 0.75,
  pressureSensitivity: 0.45
};

export const defaultTargetAiProfile: TargetAiProfile = balancedTargetProfile;