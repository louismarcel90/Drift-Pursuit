import type { FaultCode } from "../reasoning/index.js";

export type DegradedModeKind =
  | "partial-hud"
  | "intermittent-target-indicator"
  | "delayed-event-feed"
  | "reduced-visibility"
  | "input-drop"
  | "traffic-inconsistency";

export type DegradedModeStatus = "inactive" | "active" | "recovered";

export type DegradedMode = {
  readonly kind: DegradedModeKind;
  readonly status: DegradedModeStatus;
  readonly activatedAtTick: number;
  readonly recoveredAtTick?: number;
  readonly faultCode: FaultCode;
};
