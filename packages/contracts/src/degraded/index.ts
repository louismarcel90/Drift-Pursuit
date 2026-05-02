export type DegradedMode =
  | "none"
  | "partial"
  | "critical";

export type DegradedState = {
  level: DegradedMode;
  reason?: string;
};