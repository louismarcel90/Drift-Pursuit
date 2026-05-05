import type { DegradedModeKind, FaultCode } from "@drift-pursuit-grid/contracts";

export type FaultInjectionRule = {
  readonly faultCode: FaultCode;
  readonly degradedModeKind: DegradedModeKind;
  readonly activationChancePerTick: number;
  readonly minDurationTicks: number;
  readonly maxDurationTicks: number;
};

export type DegradedModeEngineConfig = {
  readonly enabled: boolean;
  readonly maxActiveDegradedModes: number;
  readonly rules: readonly FaultInjectionRule[];
};

export const defaultDegradedModeEngineConfig: DegradedModeEngineConfig = {
  enabled: true,
  maxActiveDegradedModes: 2,
  rules: [
    {
      faultCode: "hud-partial-failure",
      degradedModeKind: "partial",
      activationChancePerTick: 0.04,
      minDurationTicks: 6,
      maxDurationTicks: 14,
    },
    {
      faultCode: "target-indicator-intermittent",
      degradedModeKind: "intermittent-target-indicator",
      activationChancePerTick: 0.05,
      minDurationTicks: 5,
      maxDurationTicks: 12,
    },
    {
      faultCode: "event-feed-delayed",
      degradedModeKind: "delayed-event-feed",
      activationChancePerTick: 0.035,
      minDurationTicks: 4,
      maxDurationTicks: 10,
    },
    {
      faultCode: "visibility-reduced",
      degradedModeKind: "reduced-visibility",
      activationChancePerTick: 0.045,
      minDurationTicks: 5,
      maxDurationTicks: 12,
    },
    {
      faultCode: "input-drop-simulated",
      degradedModeKind: "input-drop",
      activationChancePerTick: 0.025,
      minDurationTicks: 3,
      maxDurationTicks: 8,
    },
  ],
};
