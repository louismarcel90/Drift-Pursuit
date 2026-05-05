import type { ReasonCode } from "@drift-pursuit-grid/contracts";

export type DebriefHighlightKind =
  | "excellent-control"
  | "clean-intercept"
  | "high-risk-recovery"
  | "collision-cost"
  | "target-lost"
  | "degraded-mode-impact";

export type DebriefHighlight = {
  readonly kind: DebriefHighlightKind;
  readonly tick: number;
  readonly message: string;
  readonly reasonCode?: ReasonCode;
};

export type DebriefRecord = {
  readonly missionId: string;
  readonly scenarioId: string;
  readonly finalScore: number;
  readonly highlights: readonly DebriefHighlight[];
  readonly primaryOutcomeReasonCode: ReasonCode;
};
