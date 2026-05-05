import type { ReasonCode } from "./reason-code.js";

export * from "./reason-code.js";
export * from "./fault-code.js";

export type ReasoningTrace = {
  readonly tick: number;
  readonly reasons: readonly ReasonCode[];
};
