import type { MissionStatus, SimulationMode } from "@drift-pursuit-grid/contracts";
import type { ReasonCode } from "@drift-pursuit-grid/contracts";

export type MissionObjectiveKind =
  | "learn-control"
  | "maintain-pursuit"
  | "intercept-target"
  | "evade-pursuer"
  | "survive-degraded-systems"
  | "complete-showcase";

export type MissionObjective = {
  readonly id: string;
  readonly kind: MissionObjectiveKind;
  readonly description: string;
  readonly requiredDurationTicks?: number;
  readonly targetDistanceThreshold?: number;
};

export type MissionDefinition = {
  readonly id: string;
  readonly mode: SimulationMode;
  readonly title: string;
  readonly objectives: readonly MissionObjective[];
  readonly maxTicks: number;
};

export type MissionProgress = {
  readonly missionId: string;
  readonly status: MissionStatus;
  readonly completedObjectiveIds: readonly string[];
  readonly failedReasonCode?: ReasonCode;
};