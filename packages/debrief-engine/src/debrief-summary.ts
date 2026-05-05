import type { ReasonCode, SimulationEvent } from "@drift-pursuit-grid/contracts";
import type { DebriefHighlight } from "@drift-pursuit-grid/domain";

export type DebriefOutcome = "success" | "failure" | "incomplete";

export type DebriefSummary = {
  readonly scenarioId: string;
  readonly seed: number;
  readonly totalTicks: number;
  readonly outcome: DebriefOutcome;
  readonly primaryReasonCode: ReasonCode;
  readonly headline: string;
  readonly explanation: string;
  readonly highlights: readonly DebriefHighlight[];
  readonly keyEvents: readonly SimulationEvent[];
  readonly collisionCount: number;
  readonly incidentCount: number;
  readonly finalTargetDistance: number;
  readonly finalPursuitPressure: number;
};