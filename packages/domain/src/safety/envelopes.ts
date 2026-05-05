export type DriftEnvelope = {
  readonly safeDriftFactorMax: number;
  readonly warningDriftFactorMax: number;
  readonly controlLossDriftFactorMin: number;
};

export type SpeedEnvelope = {
  readonly safeSpeedMax: number;
  readonly warningSpeedMax: number;
  readonly criticalSpeedMin: number;
};

export type InterceptEnvelope = {
  readonly minimumSafeDistance: number;
  readonly maximumCaptureDistance: number;
  readonly unsafeApproachAngleDegrees: number;
};

export type SafetyEnvelope = {
  readonly drift: DriftEnvelope;
  readonly speed: SpeedEnvelope;
  readonly intercept: InterceptEnvelope;
};

export const defaultSafetyEnvelope: SafetyEnvelope = {
  drift: {
    safeDriftFactorMax: 0.45,
    warningDriftFactorMax: 0.75,
    controlLossDriftFactorMin: 0.9,
  },
  speed: {
    safeSpeedMax: 6,
    warningSpeedMax: 9,
    criticalSpeedMin: 12,
  },
  intercept: {
    minimumSafeDistance: 2,
    maximumCaptureDistance: 4,
    unsafeApproachAngleDegrees: 65,
  },
};
