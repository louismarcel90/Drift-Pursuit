export * from "./reason-code.js";
export * from "./fault-code.js";

export type ReasonCode =
  | "collision-risk"
  | "target-locked"
  | "low-fuel"
  | "manual-override"
  | "mission-objective-completed"
  | "high-control"
  | "clean-execution";

export type ReasoningTrace = {
  tick: number;
  reasons: ReasonCode[];
};