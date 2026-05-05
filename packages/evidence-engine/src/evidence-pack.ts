import type { PlayerCommand } from "@drift-pursuit-grid/contracts";
import type { DebriefSummary } from "@drift-pursuit-grid/debrief-engine";
import type { ReplayRecord, ReplayVerificationResult } from "@drift-pursuit-grid/replay-engine";
import type { ScenarioDefinition } from "@drift-pursuit-grid/scenario-kit";
import type { AuthoritativeSimulationState } from "@drift-pursuit-grid/state-store";

export type EvidenceIntegrityManifest = {
  readonly scenarioDigest: string;
  readonly inputLogDigest: string;
  readonly eventLogDigest: string;
  readonly finalStateDigest: string;
  readonly debriefDigest: string;
  readonly replayDigest: string;
  readonly evidencePackDigest: string;
};

export type EvidencePack = {
  readonly evidenceVersion: "1.0";
  readonly generatedBy: "drift-pursuit-grid";
  readonly scenario: ScenarioDefinition;
  readonly seed: number;
  readonly tickDurationMs: number;
  readonly totalTicks: number;
  readonly inputLog: readonly PlayerCommand[];
  readonly replayRecord: ReplayRecord;
  readonly replayVerification: ReplayVerificationResult;
  readonly finalState: AuthoritativeSimulationState;
  readonly debrief: DebriefSummary;
  readonly integrity: EvidenceIntegrityManifest;
};
