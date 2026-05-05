export type DegradedModeKind =
  | "none"
  | "partial"
  | "critical"
  | "intermittent-target-indicator"
  | "delayed-event-feed"
  | "reduced-visibility"
  | "input-drop"
  | "partial-hud"
  | "critical-hud"
  | "intermittent-hud";

export type DegradedModeStatus = "active" | "recovered";

export type DegradedState = {
  level: DegradedModeKind;
  reason?: string;
};

export type DegradedMode = {
  readonly kind: DegradedModeKind;
  readonly status: DegradedModeStatus;
  readonly activatedAtTick: number;
  readonly recoveredAtTick: number;
  readonly faultCode: string;
};
